import { decodeData, encodeData, stretchKey } from "./crypt";
import assert from "assert";

it('decodeData(encodeData(x, y), z)=null', () => {
  assert.deepEqual(decodeData(encodeData({}, 'x'), 'y'), null);
  assert.deepEqual(decodeData(encodeData({ abc: '123' }, 'y'), 'x'), null);
});

it('decodeData(encodeData(x, password), password)=x', () => {
  assert.deepEqual(decodeData(encodeData({}, 'test'), 'test'), {});
  assert.deepEqual(decodeData(encodeData({ abc: '123' }, 'test'), 'test'), { abc: '123' });
});

it('strechKey(x,y)===stretchKey(x,y)', () => {
  assert.equal(stretchKey('abc', '123'), stretchKey('abc', '123'));

});

it('strechKey(x,y)!==stretchKey(x,z)', () => {
  assert.notEqual(stretchKey('abc', '123'), stretchKey('abc', '1234'));
});

it('strechKey(z,y)!==stretchKey(x,y)', () => {
  assert.notEqual(stretchKey('abc1', '123'), stretchKey('abc', '123'));
});

// this test cannot fail or we will break database decryption for existing databases
it('stretchKey(x,y)===z', () => {
  assert.equal(stretchKey('abc', '123'), '4eb28928b9f83734054978bc6aab833b');
});