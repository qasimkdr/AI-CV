import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileQuestion } from "lucide-react";

import PublicLayout from "../layouts/PublicLayout";
import Seo from "../components/seo/Seo";

export default function NotFound() {
  return (
    <PublicLayout>
      <Seo title="Page not found — AI CV" noindex />
      <section className="grid min-h-[80vh] place-items-center px-4 pt-28">
        <div className="text-center">
          <motion.div
            initial={{ rotateY: -40, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="perspective mx-auto"
          >
            <div className="glass-strong animate-float mx-auto grid h-40 w-32 place-items-center rounded-3xl">
              <FileQuestion size={48} className="text-violet" />
            </div>
          </motion.div>
          <p className="mt-10 font-display text-8xl font-extrabold text-gradient">404</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">This page went off to find a job</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            The page you're looking for doesn't exist or has moved. Let's get you back on track.
          </p>
          <Link to="/" className="btn btn-primary mt-8">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
