export default function CreativeTemplate({
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
    <div className="mx-auto flex max-w-5xl overflow-hidden rounded-xl bg-white shadow">
      {/* Sidebar */}
      <div className="w-72 bg-indigo-600 p-6 text-white">
        <h1 className="text-3xl font-bold">
          {data.personalInfo
            ?.fullName || ""}
        </h1>

        <div className="mt-4 space-y-1 text-sm">
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

        {hasSkills && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">
              Skills
            </h2>

            <div className="space-y-2">
              {data.skills.map(
                (
                  skill,
                  index
                ) => (
                  <p
                    key={index}
                  >
                    • {skill}
                  </p>
                )
              )}
            </div>
          </div>
        )}

        {hasCertifications && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">
              Certifications
            </h2>

            <div className="space-y-2">
              {data.certifications.map(
                (
                  cert,
                  index
                ) => (
                  <p
                    key={index}
                  >
                    • {cert}
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {hasExperience && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Experience
            </h2>

            {data.experience.map(
              (
                exp,
                index
              ) => (
                <div
                  key={index}
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

                  {exp.description && (
                    <p className="text-slate-600">
                      {
                        exp.description
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {hasEducation && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Education
            </h2>

            {data.education.map(
              (
                edu,
                index
              ) => (
                <div
                  key={index}
                  className="mb-4"
                >
                  {edu.degree && (
                    <h3 className="font-bold">
                      {
                        edu.degree
                      }
                    </h3>
                  )}

                  {edu.institute && (
                    <p>
                      {
                        edu.institute
                      }
                    </p>
                  )}

                  {(edu.startYear ||
                    edu.endYear) && (
                    <p className="text-sm text-slate-500">
                      {
                        edu.startYear
                      }
                      {edu.startYear &&
                      edu.endYear
                        ? " - "
                        : ""}
                      {
                        edu.endYear
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {hasProjects && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
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
                    {
                      project.title
                    }
                  </h3>

                  {project.description && (
                    <p className="text-slate-600">
                      {
                        project.description
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}