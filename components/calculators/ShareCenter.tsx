"use client";

import { useMemo, useState } from "react";
import { Copy, Download, FileText, Link2, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type TabKey = "link" | "embed" | "export" | "summary";

type Props = {
  title: string;
  shortUrl: string;
  stateUrl: string;
  summaryText: string;
  csvFilename?: string;
  csvData?: string;
  snapshotLines: string[];
};

type EmbedTheme = "light" | "dark";

function copyText(value: string): Promise<void> {
  return navigator.clipboard.writeText(value);
}

function downloadFile(filename: string, mimeType: string, content: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildSnapshotImage(title: string, lines: string[]): string {
  const width = 1200;
  const padding = 72;
  const lineHeight = 46;
  const height = padding * 2 + lineHeight * (lines.length + 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#111827";
  ctx.font = "700 42px Inter, Arial, sans-serif";
  ctx.fillText(title, padding, padding);

  ctx.font = "400 26px Inter, Arial, sans-serif";
  ctx.fillStyle = "#4b5563";
  let y = padding + 68;

  for (const line of lines) {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  }

  return canvas.toDataURL("image/png");
}

export function ShareCenter({
  title,
  shortUrl,
  stateUrl,
  summaryText,
  csvFilename,
  csvData,
  snapshotLines
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("link");
  const [embedTheme, setEmbedTheme] = useState<EmbedTheme>("light");
  const [embedShowInsights, setEmbedShowInsights] = useState(true);
  const [embedWidth, setEmbedWidth] = useState(780);
  const [status, setStatus] = useState<string>("");

  const embedUrl = useMemo(() => {
    const url = new URL(stateUrl);
    url.searchParams.set("embed", "1");
    url.searchParams.set("theme", embedTheme);
    url.searchParams.set("insights", embedShowInsights ? "1" : "0");
    return url.toString();
  }, [embedShowInsights, embedTheme, stateUrl]);

  const iframeSnippet = useMemo(() => {
    const width = Math.max(360, embedWidth);
    return `<iframe src=\"${embedUrl}\" width=\"${width}\" height=\"680\" loading=\"lazy\" style=\"border:1px solid #d6dce3;\"></iframe>`;
  }, [embedUrl, embedWidth]);

  async function handleNativeShare() {
    if (!navigator.share) {
      setStatus("Native share not available on this device.");
      return;
    }

    try {
      await navigator.share({
        title,
        text: summaryText,
        url: stateUrl
      });
      setStatus("Shared");
    } catch {
      setStatus("Share canceled");
    }
  }

  async function handleCopy(value: string, message: string) {
    try {
      await copyText(value);
      setStatus(message);
    } catch {
      setStatus("Copy failed");
    }
  }

  function handleExportPdf() {
    const popup = window.open("", "_blank", "noopener,noreferrer,width=980,height=780");
    if (!popup) {
      setStatus("Popup blocked");
      return;
    }

    popup.document.write(`
      <html>
        <head>
          <title>${title} Summary</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; margin: 40px; color: #111827; }
            h1 { margin-bottom: 12px; }
            p { white-space: pre-wrap; line-height: 1.55; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${summaryText}</p>
          <p>Link: ${stateUrl}</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    popup.document.close();
    setStatus("PDF print dialog opened");
  }

  function handleExportCsv() {
    if (!csvData || !csvFilename) {
      setStatus("No table data available");
      return;
    }

    downloadFile(csvFilename, "text/csv;charset=utf-8", csvData);
    setStatus("CSV downloaded");
  }

  function handleExportImage() {
    try {
      const dataUrl = buildSnapshotImage(title, snapshotLines);
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-snapshot.png`;
      anchor.click();
      setStatus("Image downloaded");
    } catch {
      setStatus("Image export failed");
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            className="w-full max-w-4xl rounded-xl border bg-card p-4 shadow-soft"
            role="dialog"
            aria-modal="true"
            aria-label="Share and export"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Share & Export</h3>
              <Button type="button" size="icon" variant="ghost" aria-label="Close share dialog" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Share tabs">
              {([
                ["link", "Link"],
                ["embed", "Embed"],
                ["export", "Export"],
                ["summary", "Copy Summary"]
              ] as Array<[TabKey, string]>).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  role="tab"
                  variant={tab === key ? "default" : "outline"}
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {tab === "link" ? (
              <section className="mt-4 space-y-3" aria-label="Link options">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input readOnly value={shortUrl} aria-label="Short URL" />
                  <Button type="button" onClick={() => handleCopy(shortUrl, "Short URL copied")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input readOnly value={stateUrl} aria-label="URL with inputs" />
                  <Button type="button" onClick={() => handleCopy(stateUrl, "URL with inputs copied")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <Button type="button" variant="outline" onClick={handleNativeShare}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Use Native Share
                </Button>
              </section>
            ) : null}

            {tab === "embed" ? (
              <section className="mt-4 space-y-3" aria-label="Embed options">
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Theme</span>
                    <select
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={embedTheme}
                      onChange={(event) => setEmbedTheme(event.target.value as EmbedTheme)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Width</span>
                    <Input
                      type="number"
                      min={360}
                      max={1400}
                      value={embedWidth}
                      onChange={(event) => setEmbedWidth(Number(event.target.value))}
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 self-end pb-2 text-sm text-muted-foreground">
                    <Switch checked={embedShowInsights} onCheckedChange={setEmbedShowInsights} />
                    Show insights
                  </label>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <textarea
                    className="min-h-[100px] rounded-md border bg-background p-3 text-sm"
                    value={iframeSnippet}
                    readOnly
                    aria-label="Iframe snippet"
                  />
                  <Button type="button" onClick={() => handleCopy(iframeSnippet, "Embed snippet copied")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2">
                  <iframe title="Embed preview" className="h-[340px] w-full rounded-md border bg-background" src={embedUrl} loading="lazy" />
                </div>
              </section>
            ) : null}

            {tab === "export" ? (
              <section className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Export options">
                <Button type="button" variant="outline" onClick={handleExportPdf}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button type="button" variant="outline" onClick={handleExportCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button type="button" variant="outline" onClick={handleExportImage}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              </section>
            ) : null}

            {tab === "summary" ? (
              <section className="mt-4 space-y-3" aria-label="Copy summary">
                <textarea className="min-h-[180px] w-full rounded-md border bg-background p-3 text-sm" readOnly value={summaryText} />
                <Button type="button" onClick={() => handleCopy(summaryText, "Summary copied")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Summary
                </Button>
              </section>
            ) : null}

            {status ? <p className="mt-3 text-sm text-muted-foreground">{status}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
