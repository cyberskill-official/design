# HR Suite sources (DOCX ↔ templates)

Published on Storybook **Docs** at `design.cyberskill.world`.

## Decision

**Canonical live instruments are Design Components** under `templates/vn-*/*.dc.html` (plus `doc-suite-index`, `doc-style-guide`, `doc-templates`). Google Drive / Word (`.docx` / `.dotx`) are **source provenance**, not the Storybook product surface.

Do **not** commit large binary Word files into this design-system package. Optional local unpack for diffing:

```bash
# scraps/ is gitignored
mkdir -p scraps/hr-suite-docx
unzip -O UTF-8 /path/to/Templates.zip -d scraps/hr-suite-docx
```

Keep long-lived originals outside git. The current extractor reads only `scraps/hr-suite-docx/Templates/`; place the reviewed input copy there before running it. A copy elsewhere is not discovered automatically. Record source file/archive identity and review the resulting fixture diff.

## Recorded source inventory (Templates.zip, Jul 2026)

| Count | Kind |
|---|---|
| 40 | `.docx` instruments / guides |
| 1 | `.dotx` presentation shell |
| **41** | **total in zip** |

All **37** Employment Suite `templates/vn-*` folders from the zip map 1:1 to a zip `.docx`. Four zip “0.” reference files map to `doc-*` templates. An **additional** commercial framework (not in that zip) lives at `templates/vn-framework-agreement` — see below.

## Mapping

| Zip file (English title) | Repo path |
|---|---|
| CyberSkill Document Style Guide | `templates/doc-style-guide` |
| CyberSkill Document Template (`.dotx`) | `templates/doc-templates` |
| Employment Suite Usage Guide | `templates/doc-suite-index` (usage section) |
| HR Document Suite Index | `templates/doc-suite-index` |
| Labor Contract | `templates/vn-labor-contract` |
| Exit-Handover Agreement | `templates/vn-exit-handover` |
| NDNCA & IP | `templates/vn-ndnca-ip` |
| Phantom Stock Agreement | `templates/vn-phantom-stock` |
| Total Rewards & Career Path Appendix | `templates/vn-total-rewards-appendix` |
| Labor Contract Amendment Appendix | `templates/vn-contract-amendment` |
| Appointment & Transfer Decision | `templates/vn-appointment-transfer` |
| Probation Contract | `templates/vn-probation-contract` |
| Internal Labor Regulations | `templates/vn-internal-labor-regulations` |
| Decision on Termination | `templates/vn-termination-decision` |
| Disciplinary Schedule (Annex to ILR) | `templates/vn-disciplinary-schedule` |
| Training & Service Commitment Agreement | `templates/vn-training-commitment` |
| Internship Agreement | `templates/vn-internship-agreement` |
| Employment Offer Letter | `templates/vn-offer-letter` |
| Personal Data Consent (PDPL) | `templates/vn-pdpl-consent` |
| Foreign Employee Work Permit Pack | `templates/vn-foreign-employee-pack` |
| Independent Contractor Agreement | `templates/vn-contractor-agreement` |
| Employee Request Form | `templates/vn-employee-request` |
| Job Description | `templates/vn-job-description` |
| Acknowledgement of Receipt | `templates/vn-receipt-acknowledgement` |
| Labour Management Book | `templates/vn-labour-management-book` |
| Performance Review Form | `templates/vn-performance-review-form` |
| Onboarding Checklist | `templates/vn-onboarding-checklist` |
| Mutual NDA | `templates/vn-mutual-nda` |
| Statement of Work | `templates/vn-sow-appendix` |
| Disciplinary Case File | `templates/vn-disciplinary-case-file` |
| Certificate of Employment | `templates/vn-certificate-of-employment` |
| Resignation Letter | `templates/vn-resignation-letter` |
| Travel & Expense Policy | `templates/vn-travel-expense-policy` |
| Grassroots Democracy Regulation | `templates/vn-grassroots-democracy` |
| Salary Scale and Payroll Table | `templates/vn-salary-scale` |
| Remote & Hybrid Work Policy | `templates/vn-remote-work-policy` |
| Code of Conduct | `templates/vn-code-of-conduct` |
| Compensation & Reward Regulation | `templates/vn-compensation-regulation` |
| Personal Data Protection Policy | `templates/vn-data-protection-policy` |
| Information Security & Acceptable Use Policy | `templates/vn-infosec-policy` |
| Performance Evaluation Regulation | `templates/vn-performance-evaluation-regulation` |

### Outside Templates.zip (added Aug 2026)

| Source | Repo path | Taxonomy |
|---|---|---|
| `Hợp đồng Nguyên Tắc - CyberSkill - Ban QLDA Bình Quới.docx` (Downloads) | `templates/vn-framework-agreement` | **Commercial** software-services framework (not employment lifecycle). Uses the same VN A4 bilingual skin (`vn-*`) and appears under **Templates → HR** via the `HR Suite ·` catalog name; suite index lists it under Legal/client-facing. Adapted DOCX (gitignored): `scraps/hr-suite-docx/Templates/9. Hợp đồng Nguyên Tắc - Framework Agreement (Software Services).docx` |

## Browse on Storybook

- **Templates → Gallery → Atomic gallery** — full Atomic View Templates tier
- **Templates → HR** — every HR Suite / HR ops instrument iframe
- **Templates → Documents** — suite index / style guide / document template

## Recorded sync and current check scope

The recorded archive date is **2026-07-11**; the earlier **Aug 2026** sync is historical provenance, not a current whole-text verdict. Retained normalized text fixtures live under `_audit/fixtures/hr-suite-docx-text/`. `npm run test:docx-source-parity` checks the current templates against those fixtures without opening Word files: it selects at most 80 significant phrases per fixture, requires ≥85% matches, and allows an ordered-word fallback with ≥75% of eligible words. Added text and changes within that tolerance can pass. A passing result does not prove complete clause/text identity, formatting/export fidelity, current Word-source identity or content-owner acceptance.

Repo `.dc.html` trees remain the canonical live instruments; Word files stay out of git. When counsel or ops authorize a source update, place the reviewed inputs in `scraps/hr-suite-docx/Templates/`, update the matching `templates/vn-*/` (or `doc-*`) folder, run `node scripts/extract-hr-suite-docx-fixtures.mjs`, and review the complete source/template/fixture diff. Run the phrase guard plus the applicable rendered/export checks separately. Regenerate Storybook CSF if names change (`node scripts/generate-template-stories.mjs`).

Counsel review remains required before real-world use (client-supplied instruments; see README / SKILL).
