import { describe, expect, it } from 'vitest'
import { toggleItem } from './list'

describe('toggleItem', () => {
  it('adds a missing item at the end and removes a present one', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b'])
  })

  it('does not change the list it was given', () => {
    const list = ['a']
    toggleItem(list, 'b')
    expect(list).toEqual(['a'])
  })
})
