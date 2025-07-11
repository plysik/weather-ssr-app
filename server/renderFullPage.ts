import fs from 'fs';
import path from 'path';
export function renderFullPage(html: string, title: string, preloadedState: any) {
    const templatePath = path.resolve(__dirname, './template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    const stateScript = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>`;

    return template
        .replace('<!--TITLE-->', title)
        .replace('<!--APP-->', html)
        .replace('<!--STATE-->', stateScript)
        // Ładujemy statyczny bundle (zbudowany wcześniej Vite/webpack)
        .replace(
            '</body>',
            `<script type="module" src="/assets/index.js"></script></body>`
        );
}