// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Introduction to Loki Workshop',
  tagline: 'Logs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://grafana.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/loki-workshop',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'grafana', // Usually your GitHub org/user name.
  projectName: 'loki-workshop', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/grafana/loki-workshop/tree/main/docs/',
        },
        blog: false, // Optional: disable the blog plugin
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.png',
      navbar: {
        title: 'Introduction to Loki Workshop',
        logo: {
          alt: 'My Site Logo',
          src: 'img/loki-icon.svg',
        },
        items: [
          {
            href: 'https://github.com/grafana/loki-workshop',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/grafana-loki',
              },
              {
                label: 'Slack',
                href: 'https://slack.grafana.com/'
              },
              {
                label: 'X',
                href: 'https://x.com/grafana',
              },
            ],
          },
          {
            title: 'Learning resources',
            items: [
              {
                label: 'Get started with Grafana Loki',
                href: 'https://grafana.com/docs/loki/latest/get-started/'
              },
              {
                label: 'LogQL reference',
                href: 'https://grafana.com/docs/loki/latest/query/'
              },
              {
                label: 'Loki webinars and videos',
                href: 'https://grafana.com/videos/?technology=loki&language=en&type=on-demand',
              },
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/grafana/loki-workshop',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Grafana Labs. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
