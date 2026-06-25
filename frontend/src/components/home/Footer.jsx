import {
  Mail,
  Globe,
  Sparkles,
} from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-slate-950">

      <div className="container mx-auto px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          <div>

            <h2 className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-3xl font-black text-transparent">

              CVCraft

            </h2>

            <p className="mt-5 leading-7 text-slate-400">

              Build professional resumes
              using AI, beautiful templates
              and ATS-friendly formatting.

            </p>

          </div>

          <div>

            <h3 className="mb-5 font-bold text-white">

              Product

            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>Templates</li>
              <li>AI Enhancement</li>
              <li>PDF Export</li>
              <li>DOCX Export</li>

            </ul>

          </div>

          <div>

            <h3 className="mb-5 font-bold text-white">

              Company

            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>About</li>
              <li>Features</li>
              <li>Contact</li>
              <li>Privacy</li>

            </ul>

          </div>

          <div>

            <h3 className="mb-5 font-bold text-white">

              Connect

            </h3>

            <div className="flex gap-4">

  <div className="rounded-xl bg-slate-900 p-3 transition hover:bg-cyan-500">
    <Globe className="text-white" />
  </div>

  <div className="rounded-xl bg-slate-900 p-3 transition hover:bg-cyan-500">
    <Sparkles className="text-white" />
  </div>

  <div className="rounded-xl bg-slate-900 p-3 transition hover:bg-cyan-500">
    <Mail className="text-white" />
  </div>

</div>

          </div>

        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">

          © 2026 CVCraft.
          Built with ❤️ using React,
          Node.js and AI.

        </div>

      </div>

    </footer>
  );
}