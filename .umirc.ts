import { defineConfig } from 'dumi';

export default defineConfig({
  title: '没准认识呢',
  mode: 'site',
  logo: 'https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png',
  navs: [
    {
      title: '读书笔记',
      children: [
        {
          title: '个人成长',
          path: '/personal',
        },
        {
          path: '/fe',
          title: '前端FE',
        },
        {
          path: '/be',
          title: '后端BE',
        },
        {
          path: '/normal',
          title: '通用内功',
        },
      ],
    },
    {
      title: '闲聊',
      path: '/talks',
    },
    {
      title: '朋友圈',
      path: '/friends',
    },
    {
      title: 'ECMA262',
      path: '/ecma262',
    },
    {
      title: '俺',
      path: '/about',
    },
    {
      title: 'Github',
      path: 'https://github.com/kilicmu',
    },
  ],
  favicon: './favicon.ico',
  base: '/new-blog',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
});
