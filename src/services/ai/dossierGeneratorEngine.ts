import { resume } from '@/data/resume'

export function generateRecruiterDossierPDF() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Recruiter Candidate Dossier - Raghul Raja M</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          .header { border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
          .subtitle { font-size: 14px; color: #0284c7; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; }
          .grid { display: grid; grid-cols: 2; gap: 10px; }
          .card { background: #f8fafc; padding: 10px 15px; border-radius: 6px; border-left: 3px solid #0284c7; font-size: 13px; }
          .badge { background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
          ul { margin: 0; padding-left: 18px; font-size: 13px; }
          .footer { font-size: 11px; text-align: center; color: #64748b; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${resume.name}</h1>
            <div class="subtitle">Candidate Executive Dossier • ${resume.title}</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #475569;">
            ${resume.email}<br />
            ${resume.phone} • ${resume.location}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <p style="font-size: 13px; margin: 0; color: #334155;">
            High-velocity Full-Stack & AI Engineer with hands-on experience building ${resume.projects.length}+ production applications. Holds an 8.2 CGPA at SKP Engineering College with internship experience at TVK Technologies.
          </p>
        </div>

        <div class="section">
          <div class="section-title">Verified Core Competencies</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${resume.skills.frontend.concat(resume.skills.backend, resume.skills.ai).map(s => `<span class="badge">${s}</span>`).join(' ')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Flagship Applications</div>
          ${resume.projects.slice(0, 4).map(p => `
            <div class="card" style="margin-bottom: 8px;">
              <strong>${p.title}</strong> — <span style="color: #64748b;">${p.description}</span><br />
              <small style="color: #0284c7;">Tech: ${p.tech.join(', ')}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <div class="section-title">Verified Experience & Education</div>
          <ul style="font-size: 13px;">
            <li><strong>${resume.experience[0]?.role}</strong> at ${resume.experience[0]?.company} (${resume.experience[0]?.period}) — Developed web services & AI models.</li>
            <li><strong>${resume.education[0]?.degree}</strong> at ${resume.education[0]?.college} — CGPA: ${resume.education[0]?.cgpa}</li>
          </ul>
        </div>

        <div class="footer">
          Generated automatically by Raghul's Portfolio AI Intelligence Suite v4.0 • Verified Candidate Dossier
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
