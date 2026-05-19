function inlineFormat(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\$(.+?)\$/g, "<em class='not-italic text-[#b9d4ff]'>$1</em>");
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-6 mb-2 text-xl font-bold">
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mt-4 mb-2 text-lg font-semibold">
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        const rows = tableLines.slice(2).map((r) =>
          r
            .split("|")
            .filter(Boolean)
            .map((c) => c.trim()),
        );
        elements.push(
          <div
            key={key++}
            className="my-4 overflow-x-auto rounded-lg border border-white/10"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {headers.map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-white/5">
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-3 py-2"
                        dangerouslySetInnerHTML={{
                          __html: inlineFormat(cell),
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-3 list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li
              key={item}
              dangerouslySetInnerHTML={{ __html: inlineFormat(item) }}
            />
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p
        key={key++}
        className="my-2 leading-relaxed text-[var(--color-fg-muted)]"
        dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
      />,
    );
    i++;
  }

  return <article className="prose-nugget">{elements}</article>;
}
