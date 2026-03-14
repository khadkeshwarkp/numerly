import {
  calculateAmortizedLoan,
  round2
} from "@/lib/calculators/finance-utils";
import type {
  CalculatorInsight,
  CalculatorTableData,
  CalculatorVisualizationData
} from "@/types/calculator-engine";

type LoanInputs = {
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
};

type LoanOutputs = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export type AmortizationRow = {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

const MAX_LINE_POINTS = 120;

function buildSampledBalancePoints(rows: AmortizationRow[]) {
  if (rows.length <= MAX_LINE_POINTS) {
    return rows.map((row) => ({
      x: row.month,
      y: row.balance,
      label: `Month ${row.month}`
    }));
  }

  const step = Math.ceil(rows.length / MAX_LINE_POINTS);
  const sampled = rows.filter((_, index) => index % step === 0);
  const lastRow = rows[rows.length - 1];

  if (!sampled.length || sampled[sampled.length - 1]?.month !== lastRow.month) {
    sampled.push(lastRow);
  }

  return sampled.map((row) => ({
    x: row.month,
    y: row.balance,
    label: `Month ${row.month}`
  }));
}

export function generateAmortizationSchedule(input: LoanInputs): AmortizationRow[] {
  const loanTermMonths = Math.round(input.loanTermMonths);
  const monthlyRate = input.annualInterestRate / 100 / 12;
  const amortized = calculateAmortizedLoan(
    input.principal,
    input.annualInterestRate,
    loanTermMonths
  );

  const schedule: AmortizationRow[] = [];
  let balance = input.principal;

  for (let month = 1; month <= loanTermMonths; month += 1) {
    const interestPaid = monthlyRate === 0 ? 0 : balance * monthlyRate;
    let principalPaid = amortized.monthlyPayment - interestPaid;

    if (month === loanTermMonths || principalPaid > balance) {
      principalPaid = balance;
    }

    const payment = principalPaid + interestPaid;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      payment: round2(payment),
      principalPaid: round2(principalPaid),
      interestPaid: round2(interestPaid),
      balance: round2(balance)
    });
  }

  return schedule;
}

export function getLoanInsights(
  output: LoanOutputs,
  input: LoanInputs
): CalculatorInsight[] {
  const insights: CalculatorInsight[] = [];

  if (output.totalPayment > 0) {
    const interestShare = (output.totalInterest / output.totalPayment) * 100;
    insights.push({
      id: "interest-share",
      title: "Interest share",
      message: `${round2(interestShare)}% of your total repayment is interest.`,
      severity: "info"
    });
  }

  if (input.loanTermMonths > 60) {
    insights.push({
      id: "long-term-loan",
      title: "Long-term cost",
      message:
        "Loan terms above 60 months generally increase total interest even if monthly payments are lower.",
      severity: "warning"
    });
  }

  if (input.annualInterestRate > 10) {
    insights.push({
      id: "high-rate",
      title: "High interest rate",
      message:
        "An annual rate above 10% can materially increase repayment cost. Compare refinancing or shorter terms.",
      severity: "warning"
    });
  }

  return insights;
}

export function getLoanVisualizationData(
  output: LoanOutputs,
  input: LoanInputs
): CalculatorVisualizationData {
  const schedule = generateAmortizationSchedule(input);

  return {
    lineChart: {
      title: "Remaining Balance Over Time",
      yLabel: "Balance",
      points: buildSampledBalancePoints(schedule)
    },
    barChart: {
      title: "Principal vs Interest",
      bars: [
        { label: "Principal", value: input.principal },
        { label: "Interest", value: output.totalInterest }
      ]
    },
    pieChart: {
      title: "Repayment Composition",
      slices: [
        { label: "Principal", value: input.principal },
        { label: "Interest", value: output.totalInterest }
      ]
    }
  };
}

export function getLoanTableData(
  _output: LoanOutputs,
  input: LoanInputs
): CalculatorTableData {
  const schedule = generateAmortizationSchedule(input);

  return {
    title: "Amortization Schedule",
    pageSize: 24,
    columns: [
      { key: "month", label: "Month", format: "number" },
      { key: "payment", label: "Payment", format: "currency" },
      { key: "principalPaid", label: "Principal", format: "currency" },
      { key: "interestPaid", label: "Interest", format: "currency" },
      { key: "balance", label: "Balance", format: "currency" }
    ],
    rows: schedule
  };
}
