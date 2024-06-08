const $ = (strings: TemplateStringsArray, ...values: any[]) => {
  const finalString = strings.reduce((acc, value, index) => {
    return acc + value + (values?.[index] || "");
  }, "");

  return document.querySelector(finalString);
};

export default $;
