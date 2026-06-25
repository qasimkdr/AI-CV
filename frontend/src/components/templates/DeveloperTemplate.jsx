export default function DeveloperTemplate({
  data,
}) {
  const hasSkills =
    data.skills?.length > 0;

  const hasExperience =
    data.experience?.length > 0;

  const hasEducation =
    data.education?.length > 0;

  const hasProjects =
    data.projects?.length > 0;

  const hasCertifications =
    data.certifications?.length > 0;

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-slate-950 text-white shadow-xl">

      {/* Header */}
      <div className="border-b border-slate-800 p-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          {data.personalInfo?.fullName || ""}
        </h1>

        <div className="mt-3 space-y-1 text-sm text-slate-300">
          {data.personalInfo?.email && (
            <p>{data.personalInfo.email}</p>
          )}

          {data.personalInfo?.phone && (
            <p>{data.personalInfo.phone}</p>
          )}

          {data.personalInfo?.address && (
            <p>{data.personalInfo.address}</p>
          )}

          {data.personalInfo?.linkedin && (
            <p>{data.personalInfo.linkedin}</p>
          )}

          {data.personalInfo?.github && (
            <p>{data.personalInfo.github}</p>
          )}
        </div>
      </div>

      <div className="grid gap-8 p-8 md:grid-cols-3">

        {/* Left Sidebar */}
        <div className="space-y-8">

          {hasSkills && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-cyan-400">
                Skills
              </h2>

              <div className="space-y-2">
                {data.skills.map(
                  (skill, index) => (
                    <div
                      key={index}
                      className="rounded bg-slate-800 px-3 py-2"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {hasCertifications && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-cyan-400">
                Certifications
              </h2>

              <div className="space-y-2">
                {data.certifications.map(
                  (cert, index) => (
                    <div
                      key={index}
                      className="rounded bg-slate-800 px-3 py-2"
                    >
                      {cert}
                    </div>
                  )
                )}
              </div>
            </section>
          )}

        </div>

        {/* Main Content */}
        <div className="space-y-8 md:col-span-2">

          {hasProjects && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-cyan-400">
                Projects
              </h2>

              {data.projects.map(
                (project, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded border border-slate-800 p-4"
                  >
                    <h3 className="font-bold">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-2 text-slate-300">
                        {project.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </section>
          )}

          {hasExperience && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-cyan-400">
                Experience
              </h2>

              {data.experience.map(
                (exp, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded border border-slate-800 p-4"
                  >
                    <h3 className="font-bold">
                      {exp.position}
                    </h3>

                    <p className="text-cyan-300">
                      {exp.company}
                    </p>

                    {exp.description && (
                      <p className="mt-2 text-slate-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </section>
          )}

          {hasEducation && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-cyan-400">
                Education
              </h2>

              {data.education.map(
                (edu, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded border border-slate-800 p-4"
                  >
                    {edu.degree && (
                      <h3 className="font-bold">
                        {edu.degree}
                      </h3>
                    )}

                    {edu.institute && (
                      <p className="text-cyan-300">
                        {edu.institute}
                      </p>
                    )}

                    {(edu.startYear ||
                      edu.endYear) && (
                      <p className="mt-1 text-sm text-slate-400">
                        {edu.startYear}
                        {edu.startYear &&
                        edu.endYear
                          ? " - "
                          : ""}
                        {edu.endYear}
                      </p>
                    )}
                  </div>
                )
              )}
            </section>
          )}

        </div>

      </div>
    </div>
  );
}