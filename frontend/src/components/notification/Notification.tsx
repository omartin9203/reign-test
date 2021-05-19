import React from 'react';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

interface Options {
  type: 'success' | 'danger' | 'info' | 'default' | 'warning';
  title: string | React.ReactNode | React.FunctionComponent;
  message: string | React.ReactNode | React.FunctionComponent;
}

export function addNotification(opts: Options) {

  store.addNotification({
    // content: getNotification(severity, text),
    container: 'top-center',
    animationIn: ["animated", "flipInX"],
    animationOut: ["animated", "flipInX"],
    dismiss: {
      duration: 5000
    },
    type: opts.type,
    title: opts.title,
    message: opts.message?.toString() ?? "",
  });
}

export class Notice {
  static error(text: string, t = (x:string) => x) {
    addNotification({
      type: "danger",
      title: t('ERROR'),
      message: text,
    });
  }
  static warning(text: string, t = (x:string) => x) {
    addNotification({
      type: "warning",
      title: t('WARNING'),
      message: text,
    });
  }
  static success(text: string, t = (x:string) => x) {
    addNotification({
      type: "success",
      title: t('SUCCESS'),
      message: text,
    });
  }
  static info(text: string, t = (x:string) => x) {
    addNotification({
      type: "info",
      title: t('INFO'),
      message: text,
    });
  }
}
