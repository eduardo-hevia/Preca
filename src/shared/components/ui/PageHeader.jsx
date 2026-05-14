/**
 * @file shared/components/ui/PageHeader.jsx
 * @description PageHeader con eyebrow + título serif — estilo acreditación Core Access BT.
 */
export const PageHeader = ({ title, subtitle, moduleTag, actions }) => (
  <div className="page-header">
    <div className="page-header__content">
      <p className="page-header__eyebrow">Maestros de Asambleas · BANTRAB</p>
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      {moduleTag && <span className="page-header__tag">{moduleTag}</span>}
    </div>
    {actions && <div className="page-header__actions">{actions}</div>}
  </div>
);
