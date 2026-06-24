# verai

This repository contains generator scripts for VERIFAI product and technical Word documents.

## Project structure

- `scripts/`
  - `generate_prd.js` — create `docs/VERIFAI_PRD.docx`
  - `generate_trd.js` — create `docs/VERIFAI_TRD.docx`
  - `create_blank_docx.py` — helper script to create a blank `.docx`
- `docs/`
  - `blank.docx` — blank Word document placeholder
  - `VERIFAI_TRD.docx` — generated TRD document
- `skills/`
  - `docx_skill.md` — DOCX / Word document skill guidance
- `package.json` — npm metadata and generator commands
- `package-lock.json` — npm lockfile

## Usage

Install dependencies:

```powershell
npm install
```

Generate the PRD document:

```powershell
npm run generate:prd
```

Generate the TRD document:

```powershell
npm run generate:trd
```

Create a blank Word document:

```powershell
python scripts/create_blank_docx.py
```
