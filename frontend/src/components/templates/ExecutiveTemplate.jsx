export default function ExecutiveTemplate({
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
    <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">

      {/* Header */}
      <div className="bg-slate-900 p-8 text-white">
        <h1 className="text-4xl font-bold">
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

        {/* Left */}
        <div className="space-y-8">

          {hasSkills && (
            <section>
              <h2 className="mb-4 border-b pb-2 text-xl font-bold">
                Skills
              </h2>

              <ul className="space-y-2">
                {data.skills.map(
                  (skill, index) => (
                    <li key={index}>
                      • {skill}
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {hasCertifications && (
            <section>
              <h2 className="mb-4 border-b pb-2 text-xl font-bold">
                Certifications
              </h2>

              <ul className="space-y-2">
                {data.certifications.map(
                  (cert, index) => (
                    <li key={index}>
                      • {cert}
                    </li>
                  )
                )}
              </ul>
            </section>
          )}
        </div>

        {/* Right */}
        <div className="space-y-8 md:col-span-2">

          {hasExperience && (
            <section>
              <h2 className="mb-4 border-b pb-2 text-2xl font-bold">
                Experience
              </h2>

              {data.experience.map(
                (exp, index) => (
                  <div
                    key={index}
                    className="mb-6"
                  >
                    <h3 className="text-lg font-bold">
                      {exp.position}
                    </h3>

                    <p className="font-medium text-slate-600">
                      {exp.company}
                    </p>

                    {exp.description && (
                      <p className="mt-2 text-slate-700">
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
              <h2 className="mb-4 border-b pb-2 text-2xl font-bold">
                Education
              </h2>

              {data.education.map(
                (edu, index) => (
                  <div
                    key={index}
                    className="mb-5"
                  >
                    {edu.degree && (
                      <h3 className="font-bold">
                        {edu.degree}
                      </h3>
                    )}

                    {edu.institute && (
                      <p>{edu.institute}</p>
                    )}

                    {(edu.startYear ||
                      edu.endYear) && (
                      <p className="text-sm text-slate-500">
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

          {hasProjects && (
            <section>
              <h2 className="mb-4 border-b pb-2 text-2xl font-bold">
                Projects
              </h2>

              {data.projects.map(
                (
                  project,
                  index
                ) => (
                  <div
                    key={index}
                    className="mb-5"
                  >
                    <h3 className="font-bold">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-2 text-slate-700">
                        {project.description}
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