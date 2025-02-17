import { activeEffect } from './effect'

export const track = (target: object, key: string) => {
  if (activeEffect) {
    console.log('依赖收集', activeEffect, key)
  }

}