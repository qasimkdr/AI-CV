export default function ModernTemplate({
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
    <div className="mx-auto max-w-5xl bg-white p-8 shadow">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold text-indigo-600">
          {data.personalInfo
            ?.fullName || ""}
        </h1>

        <div className="mt-2 space-y-1 text-sm text-slate-600">
          {data.personalInfo
            ?.email && (
            <p>
              {
                data
                  .personalInfo
                  .email
              }
            </p>
          )}

          {data.personalInfo
            ?.phone && (
            <p>
              {
                data
                  .personalInfo
                  .phone
              }
            </p>
          )}

          {data.personalInfo
            ?.address && (
            <p>
              {
                data
                  .personalInfo
                  .address
              }
            </p>
          )}

          {data.personalInfo
            ?.linkedin && (
            <p>
              {
                data
                  .personalInfo
                  .linkedin
              }
            </p>
          )}

          {data.personalInfo
            ?.github && (
            <p>
              {
                data
                  .personalInfo
                  .github
              }
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8">
          {hasSkills && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Skills
              </h2>

              <ul className="space-y-1">
                {data.skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <li
                      key={
                        index
                      }
                    >
                      • {skill}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {hasCertifications && (
  <div>
    <h2 className="mb-4 text-xl font-semibold">
      Certifications
    </h2>

    <ul className="space-y-2">
      {data.certifications.map(
        (cert, index) => (
          <li
            key={index}
            className="text-sm"
          >
            • {cert}
          </li>
        )
      )}
    </ul>
  </div>
)}
        </div>

        {/* Right Column */}
        <div className="space-y-8 md:col-span-2">
          {hasExperience && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Experience
              </h2>

              {data.experience.map(
                (
                  exp,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="mb-6"
                  >
                    <h3 className="font-bold">
                      {
                        exp.position
                      }
                    </h3>

                    <p>
                      {
                        exp.company
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        exp.description
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          {hasEducation && (
  <div>
    <h2 className="mb-4 text-xl font-semibold">
      Education
    </h2>

    {data.education.map(
      (edu, index) => (
        <div
          key={index}
          className="mb-4"
        >
          {edu.degree && (
            <h3 className="font-bold">
              {edu.degree}
            </h3>
          )}

          {edu.institute && (
            <p>
              {edu.institute}
            </p>
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
  </div>
)}

          {hasProjects && (
  <div>
    <h2 className="mb-4 text-xl font-semibold">
      Projects
    </h2>

    {data.projects.map(
      (project, index) => (
        <div
          key={index}
          className="mb-5"
        >
          <h3 className="font-bold">
            {project.title}
          </h3>

          {project.description && (
            <p className="text-sm text-slate-600">
              {project.description}
            </p>
          )}
        </div>
      )
    )}
  </div>
)}
        </div>
      </div>
    </div>
  );
}