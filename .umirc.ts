import { defineConfig } from 'dumi';

export default defineConfig({
  title: '没准认识呢',
  mode: 'site',
  logo: 'https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png',
  navs: [
    {
      title: '多通道记录',
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
        {
          path: '/block-chain',
          title: '区块链',
        },
      ],
    },
    {
      title: '闲聊',
      path: '/talks',
    },
    {
      title: 'ECMA262',
      path: '/ecma262',
    },
    {
      title: '工具使用',
      path: '/tools',
    },
    {
      title: '读书笔记',
      path: '/books',
    },
    {
      title: '算法',
      children: [
        {
          title: '刷题日记',
          path: '/algorithm',
        },
      ],
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
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
});
