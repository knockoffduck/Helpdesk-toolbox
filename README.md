
# 🧩 MSP Call Template Tool

A lightweight web app that helps **MSP service desk analysts** document calls quickly and consistently.
It guides you through a simple call template, saves your notes automatically in the browser,
and generates a clean **Markdown summary** ready to paste into your ticketing system.

Built with **Astro**, **React**, and **Shadcn/UI** for speed, simplicity, and a modern feel.

---

## 🚀 Features

✅ **Structured call template** — keeps each call consistent
✅ **Markdown summary generator** — ready-to-copy formatted text
✅ **Automatic save** — persists your work in `localStorage`
✅ **Clear form button** — start fresh anytime
✅ **Local-first** — works completely offline, perfect for internal or home setups

---

## 🧱 Template Layout

Each call record includes:

- **Caller Name**
- **Issue**
- **Troubleshooting Steps**
- **Resolution**
- **Follow-up Actions**

The generated Markdown looks like this:

```markdown
**Caller:** John Doe

**Issue:** Unable to print to network printer.

**Troubleshooting:**
- Checked printer queue
- Cleared stuck job
- Restarted print spooler

**Resolution:** Printing now working.

**Follow-up:** Monitor for recurring issue.
```

---

🛠️ Tech Stack

- Astro

- React

- Shadcn/UI

- TailwindCSS

- TypeScript


---

📂 Project Structure

	src/
	├── components/
	│   ├── CallTemplateForm.tsx   # Main component
	├── pages/
	│   └── index.astro            # Entry page


---

⚙️ Getting Started

1. Clone the repository

	git clone https://github.com/knockoffduck/helpdesk-toolbox
	cd helpdesk-toolbox

2. Install dependencies

	npm install

3. Start the development server

	npm run dev


---

💾 Local Data Persistence


Your call notes are stored automatically in your browser's localStorage,

so refreshing the page won't delete your progress.

To clear all stored data, click the “Clear Form” button.


---

🧭 Roadmap / Future Enhancements

-  Add Shadcn toast notification when copying the summary

-  Support multiple call templates (e.g. password resets, printers, onboarding)

-  Add a dark mode toggle

-  Export notes as .txt or .md files


---

🙌 About This Project


Built by an MSP service desk analyst to improve call documentation workflow.

This tool serves as a personal productivity and learning project focused on:


- Clear, structured data capture

- Front-end development with Astro + React

- UI consistency with Shadcn
