// Renders a schema.org object as a JSON-LD script tag.
// `<` is escaped so page-owned strings can never close the script element.

export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c")
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
