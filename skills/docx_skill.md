## DOCX / Word Document Skill

Description

Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', '.dotx', or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads. Also use when extracting or reorganizing content from .docx or .dotx files, inserting or replacing images in documents, performing find-and-replace in Word files, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'template', or similar deliverable as a Word or .docx file, use this skill. Do NOT use for PDFs, spreadsheets, Google Docs, or general coding tasks unrelated to document generation.

License

Proprietary. LICENSE.txt has complete terms

DOCX creation, editing, and analysis

Overview

A .docx file is a ZIP archive containing XML files.

Quick Reference

Task
Approach
Read/analyze content
extract-text, or unpack for raw XML
Create new document
Use docx-js - see Creating New Documents below
Edit existing document
Unpack → edit XML → repack - see Editing Existing Documents below
Script paths: every scripts/... command in this document is relative to this skill's directory (the directory containing this SKILL.md). Run them from here, or prefix with the skill's absolute path.

Converting .doc to .docx

Legacy .doc files must be converted before editing:

bash
python scripts/office/soffice.py --headless --convert-to docx document.doc

Reading Content

bash
# Text extraction as markdown
extract-text document.docx

# Show tracked changes instead of accepting them
pandoc --track-changes=all document.docx -o output.md

# Raw XML access
python scripts/office/unpack.py document.docx unpacked/

Converting to Images

bash
python scripts/office/soffice.py --headless --convert-to pdf document.docx
pdftoppm -jpeg -r 150 document.pdf page
ls page-*.jpg

pdftoppm zero-pads the page number to the width of the total page count (so a 12-page PDF produces page-01.jpg…page-12.jpg, not page-1.jpg). Use the ls to get the actual filenames before reading them.

Accepting Tracked Changes

To produce a clean document with all tracked changes accepted (requires LibreOffice):

bash
python scripts/accept_changes.py input.docx output.docx

Creating New Documents

Generate .docx files with JavaScript, then validate. Install: npm install -g docx

Setup

javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink,
        InternalHyperlink, Bookmark, FootnoteReferenceRun, PositionalTab,
        PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
        TabStopType, TabStopPosition, Column, SectionType, TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak } = require('docx');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));

Validation

After creating the file, validate it. If validation fails, unpack, fix the XML, and repack.

bash
python scripts/office/validate.py doc.docx

Page Size

javascript
// CRITICAL: docx-js defaults to A4, not US Letter
// Always set page size explicitly for consistent results
sections: [{
  properties: {
    page: {
      size: {
        width: 12240,   // 8.5 inches in DXA
        height: 15840   // 11 inches in DXA
      },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
    }
  },
  children: [/* content */]
}]

Common page sizes (DXA units, 1440 DXA = 1 inch):
PaperWidthHeightContent Width (1" margins)
US Letter12,24015,8409,360
A4 (default)11,90616,8389,026

Landscape orientation: docx-js swaps width/height internally, so pass portrait dimensions and let it handle the swap:

javascript
size: {
  width: 12240,   // Pass SHORT edge as width
  height: 15840,  // Pass LONG edge as height
  orientation: PageOrientation.LANDSCAPE  // docx-js swaps them in the XML
},
// Content width = 15840 - left margin - right margin (uses the long edge)

Styles (Override Built-in Headings)

Use Arial as the default font (universally supported). Keep titles black for readability.

javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } }, // 12pt default
    paragraphStyles: [
      // IMPORTANT: Use exact IDs to override built-in styles
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } }, // outlineLevel required for TOC
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] })
    ]
  }]
});

Lists (NEVER use unicode bullets)

javascript
// ❌ WRONG - never manually insert bullet characters
new Paragraph({ children: [new TextRun("• Item")] })  // BAD
new Paragraph({ children: [new TextRun("\u2022 Item")] })  // BAD

// ✅ CORRECT - use numbering config with LevelFormat.BULLET
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Bullet item")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Numbered item")] }),
    ]
  }]
});

// ⚠️ Each reference creates INDEPENDENT numbering
// Same reference = continues (1,2,3 then 4,5,6)
// Different reference = restarts (1,2,3 then 1,2,3)

Tables

CRITICAL: Tables need dual widths - set both columnWidths on the table AND width on each cell. Without both, tables render incorrectly on some platforms.

javascript
// CRITICAL: Always set table width for consistent rendering
// CRITICAL: Use ShadingType.CLEAR (not SOLID) to prevent black backgrounds
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA }, // Always use DXA (percentages break in Google Docs)
  columnWidths: [4680, 4680], // Must sum to table width (DXA: 1440 = 1 inch)
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 4680, type: WidthType.DXA }, // Also set on each cell
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, // CLEAR not SOLID
          margins: { top: 80, bottom: 80, left: 120, right: 120 }, // Cell padding (internal, not added to width)
          children: [new Paragraph({ children: [new TextRun("Cell")] })]
        })
      ]
    })
  ]
})

Table width calculation:
Always use WidthType.DXA — WidthType.PERCENTAGE breaks in Google Docs.

javascript
// Table width = sum of columnWidths = content width
// US Letter with 1" margins: 12240 - 2880 = 9360 DXA
width: { size: 9360, type: WidthType.DXA },
columnWidths: [7000, 2360]  // Must sum to table width

Width rules:
Always use WidthType.DXA — never WidthType.PERCENTAGE (incompatible with Google Docs)
Table width must equal the sum of columnWidths
Cell width must match corresponding columnWidth
Cell margins are internal padding - they reduce content area, not add to cell width
For full-width tables: use content width (page width minus left and right margins)

Images

javascript
// CRITICAL: type parameter is REQUIRED
new Paragraph({
  children: [new ImageRun({
    type: "png", // Required: png, jpg, jpeg, gif, bmp, svg
    data: fs.readFileSync("image.png"),
    transformation: { width: 200, height: 150 },
    altText: { title: "Title", description: "Desc", name: "Name" } // All three required
  })]
})

Page Breaks

javascript
// CRITICAL: PageBreak must be inside a Paragraph
new Paragraph({ children: [new PageBreak()] })

// Or use pageBreakBefore
new Paragraph({ pageBreakBefore: true, children: [new TextRun("New page")] })

Hyperlinks

javascript
// External link
new Paragraph({
  children: [new ExternalHyperlink({
    children: [new TextRun({ text: "Click here", style: "Hyperlink" })],
    link: "https://example.com",
  })]
})

// Internal link (bookmark + reference)
// 1. Create bookmark at destination
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [
  new Bookmark({ id: "chapter1", children: [new TextRun("Chapter 1")] })
]})
// 2. Link to it
new Paragraph({ children: [new InternalHyperlink({
  children: [new TextRun({ text: "See Chapter 1", style: "Hyperlink" })],
  anchor: "chapter1",
})]})

Footnotes

javascript
const doc = new Document({
  footnotes: {
    1: { children: [new Paragraph("Source: Annual Report 2024")] },
    2: { children: [new Paragraph("See appendix for methodology")] },
  },
  sections: [{
    children: [new Paragraph({
      children: [
        new TextRun("Revenue grew 15%"),
        new FootnoteReferenceRun(1),
        new TextRun(" using adjusted metrics"),
        new FootnoteReferenceRun(2),
      ],
    })]
  }]
});

Tab Stops

javascript
// Right-align text on same line (e.g., date opposite a title)
new Paragraph({
  children: [
    new TextRun("Company Name"),
    new TextRun("\tJanuary 2025"),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
})

// Dot leader (e.g., TOC-style)
new Paragraph({
  children: [
    new TextRun("Introduction"),
    new TextRun({ children: [
      new PositionalTab({
        alignment: PositionalTabAlignment.RIGHT,
        relativeTo: PositionalTabRelativeTo.MARGIN,
        leader: PositionalTabLeader.DOT,
      }),
      "3",
    ]}),
  ],
})

Multi-Column Layouts

javascript
// Equal-width columns
sections: [{
  properties: {
    column: {
      count: 2,          // number of columns
      space: 720,        // gap between columns in DXA (720 = 0.5 inch)
      equalWidth: true,
      separate: true,    // vertical line between columns
    },
  },
  children: [/* content flows naturally across columns */]
}]

// Custom-width columns (equalWidth must be false)
sections: [{
  properties: {
    column: {
      equalWidth: false,
      children: [
        new Column({ width: 5400, space: 720 }),
        new Column({ width: 3240 }),
      ],
    },
  },
  children: [/* content */]
}]

Force a column break with a new section using type: SectionType.NEXT_COLUMN.

Table of Contents

javascript
// CRITICAL: Headings must use HeadingLevel ONLY - no custom styles
new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" })

Headers/Footers

javascript
sections: [{
  properties: {
    page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } // 1440 = 1 inch
  },
  headers: {
    default: new Header({ children: [new Paragraph({ children: [new TextRun("Header")] })] })
  },
  footers: {
    default: new Footer({ children: [new Paragraph({
      children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
    })] })
  },
  children: [/* content */]
}]

Critical Rules for docx-js

Set page size explicitly - docx-js defaults to A4; use US Letter (12240 x 15840 DXA) for US documents
Landscape: pass portrait dimensions - docx-js swaps width/height internally; pass short edge as width, long edge as height, and set orientation: PageOrientation.LANDSCAPE
Never use \n  - use separate Paragraph elements
Never use unicode bullets - use LevelFormat.BULLET with numbering config
PageBreak must be in Paragraph - standalone creates invalid XML
ImageRun requires type - always specify png/jpg/etc
Always set table width with DXA - never use WidthType.PERCENTAGE (breaks in Google Docs)
Tables need dual widths - columnWidths array AND cell width, both must match
Table width = sum of columnWidths - for DXA, ensure they add up exactly
Always add cell margins - use margins: { top: 80, bottom: 80, left: 120, right: 120 } for readable padding
Use ShadingType.CLEAR - never SOLID for table shading
Never use tables as dividers/rules - cells have minimum height and render as empty boxes (including in headers/footers); use border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } } on a Paragraph instead. For two-column footers, use tab stops (see Tab Stops section), not tables
TOC requires HeadingLevel only - no custom styles on heading paragraphs
Override built-in styles - use exact IDs: "Heading1", "Heading2", etc.
Include outlineLevel - required for TOC (0 for H1, 1 for H2, etc.)

Editing Existing Documents

Follow all 3 steps in order.

Step 1: Unpack

bash
python scripts/office/unpack.py document.docx unpacked/

Extracts XML, pretty-prints, merges adjacent runs, and converts smart quotes to XML entities (&#x201C; etc.) so they survive editing. Use --merge-runs false to skip run merging.

Step 2: Edit XML

Edit files in unpacked/word/. See XML Reference below for patterns.

Use "Claude" as the author for tracked changes and comments, unless the user explicitly requests use of a different name.

Use the Edit tool directly for string replacement. Do not write Python scripts. Scripts introduce unnecessary complexity. The Edit tool shows exactly what is being replaced.

CRITICAL: Use smart quotes for new content. When adding text with apostrophes or quotes, use XML entities to produce smart quotes:

xml
<!-- Use these entities for professional typography -->
<w:t>Here&#x2019;s a quote: &#x201C;Hello&#x201D;</w:t>
EntityCharacter
&#x2018;‘ (left single)
&#x2019;’ (right single / apostrophe)
&#x201C;“ (left double)
&#x201D;” (right double)

Adding comments: Use comment.py to handle boilerplate across multiple XML files (text must be pre-escaped XML):

bash
python scripts/comment.py unpacked/ 0 "Comment text with &amp;amp; and &#x2019;"
python scripts/comment.py unpacked/ 1 "Reply text" --parent 0  # reply to comment 0
python scripts/comment.py unpacked/ 0 "Text" --author "Custom Author"  # custom author name

Then add markers to document.xml (see Comments in XML Reference).

Step 3: Pack

bash
python scripts/office/pack.py unpacked/ output.docx --original document.docx

Validates with auto-repair, condenses XML, and creates DOCX. Use --validate false to skip.

Auto-repair will fix:
durableId >= 0x7FFFFFFF (regenerates valid ID)
Missing xml:space="preserve" on <w:t> with whitespace

Auto-repair won't fix:
Malformed XML, invalid element nesting, missing relationships, schema violations

Common Pitfalls

Replace entire <w:r> elements: When adding tracked changes, replace the whole <w:r>...</w:r> block with <w:del>...<w:ins>... as siblings. Don't inject tracked change tags inside a run.
Preserve <w:rPr> formatting: Copy the original run's <w:rPr> block into your tracked change runs to maintain bold, font size, etc.

XML Reference

Schema Compliance

Element order in <w:pPr>: <w:pStyle>, <w:numPr>, <w:spacing>, <w:ind>, <w:jc>, <w:rPr> last
Whitespace: Add xml:space="preserve" to <w:t> with leading/trailing spaces
RSIDs: Must be 8-digit hex (e.g., 00AB1234)

Tracked Changes

Insertion:
xml
<w:ins w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:t>inserted text</w:t></w:r>
</w:ins>

Deletion:
xml
<w:del w:id="2" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>

Inside <w:del>: Use <w:delText> instead of <w:t>, and <w:delInstrText> instead of <w:instrText>.

Minimal edits - only mark what changes:
xml
<!-- Change "30 days" to "60 days" -->
<w:r><w:t>The term is </w:t></w:r>
<w:del w:id="1" w:author="Claude" w:date="...">
  <w:r><w:delText>30</w:delText></w:r>
</w:del>
<w:ins w:id="2" w:author="Claude" w:date="...">
  <w:r><w:t>60</w:t></w:r>
</w:ins>
<w:r><w:t> days.</w:t></w:r>

Deleting entire paragraphs/list items - when removing ALL content from a paragraph, also mark the paragraph mark as deleted so it merges with the next paragraph. Add <w:del/> inside <w:pPr><w:rPr>:
xml
<w:p>
  <w:pPr>
    <w:numPr>...<w:numPr>  <!-- list numbering if present -->
    <w:rPr>
      <w:del w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z"/>
    </w:rPr>
  </w:pPr>
  <w:del w:id="2" w:author="Claude" w:date="2025-01-01T00:00:00Z">
    <w:r><w:delText>Entire paragraph content being deleted...</w:delText></w:r>
  </w:del>
</w:p>

Without the <w:del/> in <w:pPr><w:rPr>, accepting changes leaves an empty paragraph/list item.

Rejecting another author's insertion - nest deletion inside their insertion:
xml
<w:ins w:author="Jane" w:id="5">
  <w:del w:author="Claude" w:id="10">
    <w:r><w:delText>their inserted text</w:delText></w:r>
  </w:del>
</w:ins>

Restoring another author's deletion - add insertion after (don't modify their deletion):
xml
<w:del w:author="Jane" w:id="5">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>
<w:ins w:author="Claude" w:id="10">
  <w:r><w:t>deleted text</w:t></w:r>
</w:ins>

Comments

After running comment.py (see Step 2), add markers to document.xml. For replies, use --parent flag and nest markers inside the parent's.

CRITICAL: <w:commentRangeStart> and <w:commentRangeEnd> are siblings of <w:r>, never inside <w:r>.
xml
<!-- Comment markers are direct children of w:p, never inside w:r -->
<w:commentRangeStart w:id="0"/>
<w:del w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted</w:delText></w:r>
</w:del>
<w:r><w:t> more text</w:t></w:r>
<w:commentRangeEnd w:id="0"/>
<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="0"/></w:r>

<!-- Comment 0 with reply 1 nested inside -->
<w:commentRangeStart w:id="0"/>
  <w:commentRangeStart w:id="1"/>
  <w:r><w:t>text</w:t></w:r>
  <w:commentRangeEnd w:id="1"/>
<w:commentRangeEnd w:id="0"/>
<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="0"/></w:r>
<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="1"/></w:r>

### License

Complete terms in LICENSE.txt

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near `#F4F1EA`) with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. Just like a human designer who's hired, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the human's design brief: create a compact token system with color, type, layout, and signature. Color: describe the palette as 4–6 named hex values. Type: the typefaces for 2+ roles (a characterful display face that's used with restraint, a complementary body face, and a utility face for captions or data if needed). Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Signature: the single unique element this page will be remembered by that embodies the brief in an appropriate way.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan exactly and deriving every color and type decision from it.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and a element-based selector like .cta). This can happen often with paddings/margins between sections.

Try to do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Not taking a risk can be a risk itself! Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots if your environment supports it – a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creators have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand, and therefore easier to use. They are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.

add this in skill file as i have taken this from claud

## DOCX / Word Document Skill

Description

Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', '.dotx', or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads. Also use when extracting or reorganizing content from .docx or .dotx files, inserting or replacing images in documents, performing find-and-replace in Word files, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'template', or similar deliverable as a Word or .docx file, use this skill. Do NOT use for PDFs, spreadsheets, Google Docs, or general coding tasks unrelated to document generation.

License

Proprietary. LICENSE.txt has complete terms

DOCX creation, editing, and analysis

Overview

A .docx file is a ZIP archive containing XML files.

Quick Reference

Task
Approach
Read/analyze content
extract-text, or unpack for raw XML
Create new document
Use docx-js - see Creating New Documents below
Edit existing document
Unpack → edit XML → repack - see Editing Existing Documents below
Script paths: every scripts/... command in this document is relative to this skill's directory (the directory containing this SKILL.md). Run them from here, or prefix with the skill's absolute path.

Converting .doc to .docx

Legacy .doc files must be converted before editing:

bash
python scripts/office/soffice.py --headless --convert-to docx document.doc

Reading Content

bash
# Text extraction as markdown
extract-text document.docx

# Show tracked changes instead of accepting them
pandoc --track-changes=all document.docx -o output.md

# Raw XML access
python scripts/office/unpack.py document.docx unpacked/

Converting to Images

bash
python scripts/office/soffice.py --headless --convert-to pdf document.docx
pdftoppm -jpeg -r 150 document.pdf page
ls page-*.jpg

pdftoppm zero-pads the page number to the width of the total page count (so a 12-page PDF produces page-01.jpg…page-12.jpg, not page-1.jpg). Use the ls to get the actual filenames before reading them.

Accepting Tracked Changes

To produce a clean document with all tracked changes accepted (requires LibreOffice):

bash
python scripts/accept_changes.py input.docx output.docx

Creating New Documents

Generate .docx files with JavaScript, then validate. Install: npm install -g docx

Setup

javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink,
        InternalHyperlink, Bookmark, FootnoteReferenceRun, PositionalTab,
        PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
        TabStopType, TabStopPosition, Column, SectionType, TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak } = require('docx');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));

Validation

After creating the file, validate it. If validation fails, unpack, fix the XML, and repack.

bash
python scripts/office/validate.py doc.docx

Page Size

javascript
// CRITICAL: docx-js defaults to A4, not US Letter
// Always set page size explicitly for consistent results
sections: [{
  properties: {
    page: {
      size: {
        width: 12240,   // 8.5 inches in DXA
        height: 15840   // 11 inches in DXA
      },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
    }
  },
  children: [/* content */]
}]

Common page sizes (DXA units, 1440 DXA = 1 inch):
PaperWidthHeightContent Width (1" margins)
US Letter12,24015,8409,360
A4 (default)11,90616,8389,026

Landscape orientation: docx-js swaps width/height internally, so pass portrait dimensions and let it handle the swap:

javascript
size: {
  width: 12240,   // Pass SHORT edge as width
  height: 15840,  // Pass LONG edge as height
  orientation: PageOrientation.LANDSCAPE  // docx-js swaps them in the XML
},
// Content width = 15840 - left margin - right margin (uses the long edge)

Styles (Override Built-in Headings)

Use Arial as the default font (universally supported). Keep titles black for readability.

javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } }, // 12pt default
    paragraphStyles: [
      // IMPORTANT: Use exact IDs to override built-in styles
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } }, // outlineLevel required for TOC
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] }),
    ]
  }]
});

Lists (NEVER use unicode bullets)

javascript
// ❌ WRONG - never manually insert bullet characters
new Paragraph({ children: [new TextRun("• Item")] })  // BAD
new Paragraph({ children: [new TextRun("\u2022 Item")] })  // BAD

// ✅ CORRECT - use numbering config with LevelFormat.BULLET
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Bullet item")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Numbered item")] }),
    ]
  }]
});

// ⚠️ Each reference creates INDEPENDENT numbering
// Same reference = continues (1,2,3 then 4,5,6)
// Different reference = restarts (1,2,3 then 1,2,3)

Tables

CRITICAL: Tables need dual widths - set both columnWidths on the table AND width on each cell. Without both, tables render incorrectly on some platforms.

javascript
// CRITICAL: Always set table width for consistent rendering
// CRITICAL: Use ShadingType.CLEAR (not SOLID) to prevent black backgrounds
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA }, // Always use DXA (percentages break in Google Docs)
  columnWidths: [4680, 4680], // Must sum to table width (DXA: 1440 = 1 inch)
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 4680, type: WidthType.DXA }, // Also set on each cell
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, // CLEAR not SOLID
          margins: { top: 80, bottom: 80, left: 120, right: 120 }, // Cell padding (internal, not added to width)
          children: [new Paragraph({ children: [new TextRun("Cell")] })]
        })
      ]
    })
  ]
})

Table width calculation:
Always use WidthType.DXA — WidthType.PERCENTAGE breaks in Google Docs.

javascript
// Table width = sum of columnWidths = content width
// US Letter with 1" margins: 12240 - 2880 = 9360 DXA
width: { size: 9360, type: WidthType.DXA },
columnWidths: [7000, 2360]  // Must sum to table width

Width rules:
Always use WidthType.DXA — never WidthType.PERCENTAGE (incompatible with Google Docs)
Table width must equal the sum of columnWidths
Cell width must match corresponding columnWidth
Cell margins are internal padding - they reduce content area, not add to cell width
For full-width tables: use content width (page width minus left and right margins)

Images

javascript
// CRITICAL: type parameter is REQUIRED
new Paragraph({
  children: [new ImageRun({
    type: "png", // Required: png, jpg, jpeg, gif, bmp, svg
    data: fs.readFileSync("image.png"),
    transformation: { width: 200, height: 150 },
    altText: { title: "Title", description: "Desc", name: "Name" } // All three required
  })]
})

Page Breaks

javascript
// CRITICAL: PageBreak must be inside a Paragraph
new Paragraph({ children: [new PageBreak()] })

// Or use pageBreakBefore
new Paragraph({ pageBreakBefore: true, children: [new TextRun("New page")] })

Hyperlinks

javascript
// External link
new Paragraph({
  children: [new ExternalHyperlink({
    children: [new TextRun({ text: "Click here", style: "Hyperlink" })],
    link: "https://example.com",
  })]
})

// Internal link (bookmark + reference)
// 1. Create bookmark at destination
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [
  new Bookmark({ id: "chapter1", children: [new TextRun("Chapter 1")] }),
]})
// 2. Link to it
new Paragraph({ children: [new InternalHyperlink({
  children: [new TextRun({ text: "See Chapter 1", style: "Hyperlink" })],
  anchor: "chapter1",
})]})

Footnotes

javascript
const doc = new Document({
  footnotes: {
    1: { children: [new Paragraph("Source: Annual Report 2024")] },
    2: { children: [new Paragraph("See appendix for methodology")] },
  },
  sections: [{
    children: [new Paragraph({
      children: [
        new TextRun("Revenue grew 15%"),
        new FootnoteReferenceRun(1),
        new TextRun(" using adjusted metrics"),
        new FootnoteReferenceRun(2),
      ],
    })]
  }]
});

Tab Stops

javascript
// Right-align text on same line (e.g., date opposite a title)
new Paragraph({
  children: [
    new TextRun("Company Name"),
    new TextRun("\tJanuary 2025"),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
})

// Dot leader (e.g., TOC-style)
new Paragraph({
  children: [
    new TextRun("Introduction"),
    new TextRun({ children: [
      new PositionalTab({
        alignment: PositionalTabAlignment.RIGHT,
        relativeTo: PositionalTabRelativeTo.MARGIN,
        leader: PositionalTabLeader.DOT,
      }),
      "3",
    ]}),
  ],
})

Multi-Column Layouts

javascript
// Equal-width columns
sections: [{
  properties: {
    column: {
      count: 2,          // number of columns
      space: 720,        // gap between columns in DXA (720 = 0.5 inch)
      equalWidth: true,
      separate: true,    // vertical line between columns
    },
  },
  children: [/* content flows naturally across columns */]
}]

// Custom-width columns (equalWidth must be false)
sections: [{
  properties: {
    column: {
      equalWidth: false,
      children: [
        new Column({ width: 5400, space: 720 }),
        new Column({ width: 3240 }),
      ],
    },
  },
  children: [/* content */]
}]

Force a column break with a new section using type: SectionType.NEXT_COLUMN.

Table of Contents

javascript
// CRITICAL: Headings must use HeadingLevel ONLY - no custom styles
new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" })

Headers/Footers

javascript
sections: [{
  properties: {
    page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } // 1440 = 1 inch
  },
  headers: {
    default: new Header({ children: [new Paragraph({ children: [new TextRun("Header")] })] })
  },
  footers: {
    default: new Footer({ children: [new Paragraph({
      children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
    })] })
  },
  children: [/* content */]
}]

Critical Rules for docx-js

Set page size explicitly - docx-js defaults to A4; use US Letter (12240 x 15840 DXA) for US documents
Landscape: pass portrait dimensions - docx-js swaps width/height internally; pass short edge as width, long edge as height, and set orientation: PageOrientation.LANDSCAPE
Never use \n  - use separate Paragraph elements
Never use unicode bullets - use LevelFormat.BULLET with numbering config
PageBreak must be in Paragraph - standalone creates invalid XML
ImageRun requires type - always specify png/jpg/etc
Always set table width with DXA - never use WidthType.PERCENTAGE (breaks in Google Docs)
Tables need dual widths - columnWidths array AND cell width, both must match
Table width = sum of columnWidths - for DXA, ensure they add up exactly
Always add cell margins - use margins: { top: 80, bottom: 80, left: 120, right: 120 } for readable padding
Use ShadingType.CLEAR - never SOLID for table shading
Never use tables as dividers/rules - cells have minimum height and render as empty boxes (including in headers/footers); use border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } } on a Paragraph instead. For two-column footers, use tab stops (see Tab Stops section), not tables
TOC requires HeadingLevel only - no custom styles on heading paragraphs
Override built-in styles - use exact IDs: "Heading1", "Heading2", etc.
Include outlineLevel - required for TOC (0 for H1, 1 for H2, etc.)

Editing Existing Documents

Follow all 3 steps in order.

Step 1: Unpack

bash
python scripts/office/unpack.py document.docx unpacked/

Extracts XML, pretty-prints, merges adjacent runs, and converts smart quotes to XML entities (&#x201C; etc.) so they survive editing. Use --merge-runs false to skip run merging.

Step 2: Edit XML

Edit files in unpacked/word/. See XML Reference below for patterns.

Use "Claude" as the author for tracked changes and comments, unless the user explicitly requests use of a different name.

Use the Edit tool directly for string replacement. Do not write Python scripts. Scripts introduce unnecessary complexity. The Edit tool shows exactly what is being replaced.

CRITICAL: Use smart quotes for new content. When adding text with apostrophes or quotes, use XML entities to produce smart quotes:

xml
<!-- Use these entities for professional typography -->
<w:t>Here&#x2019;s a quote: &#x201C;Hello&#x201D;</w:t>
EntityCharacter
&#x2018;‘ (left single)
&#x2019;’ (right single / apostrophe)
&#x201C;“ (left double)
&#x201D;” (right double)

Adding comments: Use comment.py to handle boilerplate across multiple XML files (text must be pre-escaped XML):

bash
python scripts/comment.py unpacked/ 0 "Comment text with &amp;amp; and &#x2019;"
python scripts/comment.py unpacked/ 1 "Reply text" --parent 0  # reply to comment 0
python scripts/comment.py unpacked/ 0 "Text" --author "Custom Author"  # custom author name

Then add markers to document.xml (see Comments in XML Reference).

Step 3: Pack

bash
python scripts/office/pack.py unpacked/ output.docx --original document.docx

Validates with auto-repair, condenses XML, and creates DOCX. Use --validate false to skip.

Auto-repair will fix:
durableId >= 0x7FFFFFFF (regenerates valid ID)
Missing xml:space="preserve" on <w:t> with whitespace

Auto-repair won't fix:
Malformed XML, invalid element nesting, missing relationships, schema violations

Common Pitfalls

Replace entire <w:r> elements: When adding tracked changes, replace the whole <w:r>...</w:r> block with <w:del>...<w:ins>... as siblings. Don't inject tracked change tags inside a run.
Preserve <w:rPr> formatting: Copy the original run's <w:rPr> block into your tracked change runs to maintain bold, font size, etc.

XML Reference

Schema Compliance

Element order in <w:pPr>: <w:pStyle>, <w:numPr>, <w:spacing>, <w:ind>, <w:jc>, <w:rPr> last
Whitespace: Add xml:space="preserve" to <w:t> with leading/trailing spaces
RSIDs: Must be 8-digit hex (e.g., 00AB1234)

Tracked Changes

Insertion:
xml
<w:ins w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:t>inserted text</w:t></w:r>
</w:ins>

Deletion:
xml
<w:del w:id="2" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>

Inside <w:del>: Use <w:delText> instead of <w:t>, and <w:delInstrText> instead of <w:instrText>.

Minimal edits - only mark what changes:
xml
<!-- Change "30 days" to "60 days" -->
<w:r><w:t>The term is </w:t></w:r>
<w:del w:id="1" w:author="Claude" w:date="...">
  <w:r><w:delText>30</w:delText></w:r>
</w:del>
<w:ins w:id="2" w:author="Claude" w:date="...">
  <w:r><w:t>60</w:t></w:r>
</w:ins>
<w:r><w:t> days.</w:t></w:r>

Deleting entire paragraphs/list items - when removing ALL content from a paragraph, also mark the paragraph mark as deleted so it merges with the next paragraph. Add <w:del/> inside <w:pPr><w:rPr>:
xml
<w:p>
  <w:pPr>
    <w:numPr>...<w:numPr>  <!-- list numbering if present -->
    <w:rPr>
      <w:del w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z"/>
    </w:rPr>
  </w:pPr>
  <w:del w:id="2" w:author="Claude" w:date="2025-01-01T00:00:00Z">
    <w:r><w:delText>Entire paragraph content being deleted...</w:delText></w:r>
  </w:del>
</w:p>

Without the <w:del/> in <w:pPr><w:rPr>, accepting changes leaves an empty paragraph/list item.

Rejecting another author's insertion - nest deletion inside their insertion:
xml
<w:ins w:author="Jane" w:id="5">
  <w:del w:author="Claude" w:id="10">
    <w:r><w:delText>their inserted text</w:delText></w:r>
  </w:del>
</w:ins>

Restoring another author's deletion - add insertion after (don't modify their deletion):
xml
<w:del w:author="Jane" w:id="5">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>
<w:ins w:author="Claude" w:id="10">
  <w:r><w:t>deleted text</w:t></w:r>
</w:ins>

Comments

After running comment.py (see Step 2), add markers to document.xml. For replies, use --parent flag and nest markers inside the parent's.

CRITICAL: <w:commentRangeStart> and <w:commentRangeEnd> are siblings of <w:r>, never inside <w:r>.
xml
<!-- Comment markers are direct children of w:p, never inside w:r -->
<w:commentRangeStart w:id="0"/>
<w:del w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted</w:delText></w:r>
</w:del>
<w:r><w:t> more text</w:t></w:r>
<w:commentRangeEnd w:id="0"/>
<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="0"/></w:r>

<!-- Comment 0 with reply 1 nested inside -->
<w:commentRangeStart w:id="0"/>
  <w:commentRangeStart w:id="1"/>
  <w:r><w:t>text</w:t></w:r>
  <w:commentRangeEnd w:id="1"/>
<w:commentRangeEnd w:id="0"/>
<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="0"/></w:r>
<w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="1"/></w:r>

Images

Add image file to word/media
Add relationship to word/_rels/document.xml.rels:
xml
<Relationship Id="rId5" Type=".../image" Target="media/image1.png"/>
Add content type to [Content_Types].xml:
xml
<Default Extension="png" ContentType="image/png"/>
Reference in document.xml:
xml
<w:drawing>
  <wp:inline>
    <wp:extent cx="914400" cy="914400"/>  <!-- EMUs: 914400 = 1 inch -->
    <a:graphic>
      <a:graphicData uri=".../picture">
        <pic:pic>
          <pic:blipFill><a:blip r:embed="rId5"/></pic:blipFill>
        </pic:pic>
      </a:graphicData>
    </a:graphic>
  </wp:inline>
</w:drawing>

Dependencies

pandoc: Text extraction
docx: npm install -g docx (new documents)
LibreOffice: PDF conversion (auto-configured for sandboxed environments via scripts/office/soffice.py)
Poppler: pdftoppm for images

for doc file
