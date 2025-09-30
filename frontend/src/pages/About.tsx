import BreadcrumbView from "../components/common/BreadcrumbView";
import MarkdownRenderer from "../components/common/MarkdownRenderer";
import { useSiteConfig } from "../contexts/SiteConfigContext";

const About = () => {
  const breadcrumbItems = [{ label: "システムについて", href: "/about" }];

  const { siteConfig, loading } = useSiteConfig();

  return (
    <div className="container mx-auto px-4 py-8 xl:max-w-none">
      <BreadcrumbView items={breadcrumbItems} />

      {loading ? (
        <div className="text-center py-4">読み込み中...</div>
      ) : (
        <MarkdownRenderer markdown={siteConfig?.aboutMessage || ""} />
      )}

      <div className="text-center mt-12">
        <a
          href="https://github.com/kaze-no-tani"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          © 風の谷プロジェクト
        </a>
      </div>
    </div>
  );
};

export default About;
