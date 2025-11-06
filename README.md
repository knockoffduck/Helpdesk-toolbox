
# 🧩 Helpdesk Toolkit

A lightweight web app that helps **MSP service desk analysts** work more efficiently by providing structured templates for both **phone calls** and **email communication**.
It helps you write faster, stay consistent, and maintain professional, standardised language in all user interactions.

Built with **Astro**, **React**, and **Shadcn/UI** for speed, simplicity, and a modern, cohesive feel.

---

## 🚀 Features

### 🧾 Email Template Generator
✅ **Reusable templates** — store and reuse standardised email responses
✅ **Placeholder fields** — dynamic `[FIELD]` tokens replaced with your data
✅ **Real-time preview** — updates instantly as you type
✅ **Template editing** — built-in JSON editor for local customisation
✅ **Local storage persistence** — templates are saved in your browser
✅ **Reset safety** — two-click confirmation with animation before clearing templates

### ☎️ Call Template Form
✅ **Structured call documentation** — consistent every time
✅ **Markdown summary generator** — copy easily into tickets
✅ **Automatic save** — persists in `localStorage`
✅ **Offline-ready** — runs entirely in your browser
✅ **Clear form button** — start fresh anytime

---

## 🧱 Template Layouts

### Call Record Template

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

### Email Template Example

Each email template uses `[FIELD]` placeholders, e.g.:

```text
Hi [USER_NAME],

Please approve access to the [FOLDER_NAME] folder for [REQUESTOR_NAME].

Thank you.
```

Fields dynamically appear in the form, and updates apply in real time.

---

🛠️ Tech Stack

- **Astro** — static site framework
- **React** — interactive islands (Email / Call tools)
- **Shadcn/UI** — styled components and popover UI
- **TailwindCSS** — utility-first styling
- **TypeScript** — typed components and data consistency

---

📂 Project Structure

src/

├── components/

│   ├── EmailTemplateApp.tsx   # Email template generator

│   ├── CallTemplateForm.tsx   # Call template form

│   ├── Navigation.tsx         # Simple nav between tools

├── data/

│   └── templates.json         # Default email templates

├── pages/

│   └── index.astro            # Entry page (Helpdesk Toolkit)


---

⚙️ Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/knockoffduck/helpdesk-toolbox
   cd helpdesk-toolbox
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open in your browser and use the navigation bar to switch between Email Templates and Call Templates.




---
💾 Local Data Persistence

Both the Email Template Generator and Call Template Form store data in your browser’s localStorage so progress isn’t lost on refresh.


- Edit or add templates via the Edit Templates modal

- Reset templates using the animated two-click Reset Templates button

- Clear call notes anytime with the Clear Form button


---
🧭 Roadmap / Future Enhancements


-  Toast notification when copying to clipboard

-  Dark/light mode toggle

-  Email redaction tool

-  Template categories for different departments (IT, HR, onboarding)

- AI-powered call template suggestions

- AI-powered email redaction suggestions

---
🙌 About This Project

Built by an MSP service desk analyst to improve daily workflow and promote consistency in documentation and communication.

The Helpdesk Toolkit now centralises two key workflows:


- Call Template Form – structure and summarise technical calls

- Email Template App – generate polished, reusable email responses

This project demonstrates:


- Clear data-capture workflows

- Front-end best practices with Astro + React

- UI/UX alignment through Shadcn components and Tailwind design tokens
