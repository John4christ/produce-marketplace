import React from 'react';
import { TbBasketOff } from 'react-icons/tb';

export const EmptyState = ({
  title = 'No items found',
  description = 'We could not find any produce matching your current search or filter.',
  icon: Icon = TbBasketOff,
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
