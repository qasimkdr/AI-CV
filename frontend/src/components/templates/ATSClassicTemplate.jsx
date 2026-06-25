export default function ATSClassicTemplate({
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
    <div className="mx-auto max-w-4xl bg-white p-8 shadow">
      {/* Header */}
      <div className="border-b pb-4 text-center">
        <h1 className="text-3xl font-bold">
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

      {/* Skills */}
      {hasSkills && (
        <div className="mt-6">
          <h2 className="border-b pb-2 font-bold uppercase">
            Skills
          </h2>

          <ul className="mt-3 list-disc pl-5">
            {data.skills.map(
              (
                skill,
                index
              ) => (
                <li
                  key={index}
                >
                  {skill}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div className="mt-6">
          <h2 className="border-b pb-2 font-bold uppercase">
            Experience
          </h2>

          {data.experience.map(
            (
              exp,
              index
            ) => (
              <div
                key={index}
                className="mt-4"
              >
                <h3 className="font-bold">
                  {exp.position}
                </h3>

                <p>
                  {exp.company}
                </p>

                {exp.description && (
                  <p className="text-sm text-slate-600">
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

      {/* Education */}
      {hasEducation && (
        <div className="mt-6">
          <h2 className="border-b pb-2 font-bold uppercase">
            Education
          </h2>

          {data.education.map(
            (
              edu,
              index
            ) => (
              <div
                key={index}
                className="mt-4"
              >
                {edu.degree && (
                  <h3 className="font-bold">
                    {edu.degree}
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
                    {edu.endYear}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div className="mt-6">
          <h2 className="border-b pb-2 font-bold uppercase">
            Projects
          </h2>

          {data.projects.map(
            (
              project,
              index
            ) => (
              <div
                key={index}
                className="mt-4"
              >
                <h3 className="font-bold">
                  {
                    project.title
                  }
                </h3>

                {project.description && (
                  <p className="text-sm text-slate-600">
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

      {/* Certifications */}
      {hasCertifications && (
        <div className="mt-6">
          <h2 className="border-b pb-2 font-bold uppercase">
            Certifications
          </h2>

          <ul className="mt-3 list-disc pl-5">
            {data.certifications.map(
              (
                cert,
                index
              ) => (
                <li
                  key={index}
                >
                  {cert}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}