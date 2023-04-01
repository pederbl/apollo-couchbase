type ResourceNameForms = {
  singularLowerCase: string;
  singularCapitalized: string;
  pluralLowerCase: string;
  pluralCapitalized: string;
};

function generateResourceNameForms(resourceName: string): ResourceNameForms {
  const singularLowerCase = resourceName.slice(0, -1);
  const singularCapitalized = singularLowerCase.charAt(0).toUpperCase() + singularLowerCase.slice(1);
  const pluralLowerCase = resourceName.toLowerCase();
  const pluralCapitalized = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  return { singularLowerCase, singularCapitalized, pluralLowerCase, pluralCapitalized };
}

export { ResourceNameForms, generateResourceNameForms };
