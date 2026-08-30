import { gzipSync } from "node:zlib";
import type { ClinicContent } from "./types";
import { compileLandingPageToHtml } from "./static-compiler";
import { TEMPLATES_DICTIONARY, DEFAULT_CLINIC_DATA } from "./builder-types";

export function renderClinicHtml(content?: ClinicContent, templateId: string = "care-standard") {
  const templateSeed = TEMPLATES_DICTIONARY[templateId] || DEFAULT_CLINIC_DATA;
  const pageData = structuredClone(templateSeed);

  if (content && content.hospitalName) {
    pageData.name = content.hospitalName;
    pageData.sections = pageData.sections.map((sec) => {
      if (sec.type === "navbar" && "hospitalName" in sec.data) {
        return { ...sec, data: { ...sec.data, hospitalName: content.hospitalName } };
      }
      if (sec.type === "footer" && "hospitalName" in sec.data) {
        return { ...sec, data: { ...sec.data, hospitalName: content.hospitalName } };
      }
      if (sec.type === "hero" && "headline" in sec.data && content.heroTitle) {
        const heroData = sec.data as { headline: string; subheadline?: string };
        return { ...sec, data: { ...sec.data, headline: content.heroTitle, subheadline: content.heroBody || heroData.subheadline || "" } };
      }
      return sec;
    });
  }

  return compileLandingPageToHtml(pageData, false);
}

function tarHeader(name: string, size: number) {
  const header = Buffer.alloc(512, 0);
  header.write(name.slice(0, 100), 0, "utf8");
  header.write("0000644\0", 100, 8, "utf8");
  header.write("0000000\0", 108, 8, "utf8");
  header.write("0000000\0", 116, 8, "utf8");
  header.write(size.toString(8).padStart(11, "0") + "\0", 124, 12, "utf8");
  header.write(Math.floor(Date.now() / 1000).toString(8).padStart(11, "0") + "\0", 136, 12, "utf8");
  header.fill(" ", 148, 156);
  header.write("0", 156, 1, "utf8");
  header.write("ustar\0", 257, 6, "utf8");
  header.write("00", 263, 2, "utf8");
  let sum = 0;
  for (const byte of header) sum += byte;
  header.write(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8, "utf8");
  return header;
}

export function buildStaticArchive(content: ClinicContent, templateId: string = "care-standard") {
  const index = Buffer.from(renderClinicHtml(content, templateId), "utf8");
  const padding = Buffer.alloc((512 - (index.length % 512)) % 512);
  const tar = Buffer.concat([tarHeader("index.html", index.length), index, padding, Buffer.alloc(1024)]);
  return gzipSync(tar);
}
