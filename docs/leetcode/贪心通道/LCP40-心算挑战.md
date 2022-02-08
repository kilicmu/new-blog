## LCP40-心算挑战

### 链接

https://leetcode-cn.com/problems/uOAnQW

### 描述

「力扣挑战赛」心算项目的挑战比赛中，要求选手从 N 张卡牌中选出 cnt 张卡牌，若这 cnt 张卡牌数字总和为偶数，则选手成绩「有效」且得分为 cnt 张卡牌数字总和。
给定数组 cards 和 cnt，其中 cards[i] 表示第 i 张卡牌上的数字。 请帮参赛选手计算最大的有效得分。若不存在获取有效得分的卡牌方案，则返回 0。

示例 1：

输入：cards = [1,2,8,9], cnt = 3

输出：18

解释：选择数字为 1、8、9 的这三张卡牌，此时可获得最大的有效得分 1+8+9=18。

示例 2：

输入：cards = [3,3,1], cnt = 1

输出：0

解释：不存在获取有效得分的卡牌方案。

提示：

* 1 <= cnt <= cards.length <= 10^5
* 1 <= cards[i] <= 1000

### 思路

简单的贪心算法，可以解题思路如下：

1. 将 cards 给出的数字降序排序，取到最大的 cnt 个数字。
2. 若 此 cnt 个数字的和为偶数，则直接返回运算结果。
3. 若 此 cnt 个数字的和为奇数，循环取第 cnt + n 大的数字。
4. 若 cnt + n 大的数字为奇数，则将其替换为已选 cnt 个数字中最小偶数。cnt + n大的数字为偶数，相反。
5. 若 cnt + n > cards.length 仍不存在可替换数字，则返回 0。

### 代码

TS:

```ts
function maxmiumScore(cards: number[], cnt: number): number {
    cards = cards.sort((a, b) => b - a)
    const tmpSelected = cards.slice(0, cnt)
    const tmpSelectedSum = tmpSelected.reduce((acc, n) => acc + n, 0)

    if(tmpSelectedSum % 2 === 0) {
        return tmpSelectedSum
    }

    while(cnt < cards.length) {
        if(cards[cnt] % 2 === 1) {
        // 剩余最大为奇数
            for(let i = tmpSelected.length - 1; i >= 0; i--) {
                if(tmpSelected[i] % 2 === 0) {
                    return tmpSelectedSum - tmpSelected[i] + cards[cnt]
                }
            }
        } else if(cards[cnt] % 2 === 0) {
            for(let i = tmpSelected.length - 1; i >= 0; i--) {
                if(tmpSelected[i] % 2 === 1) {
                    return tmpSelectedSum - tmpSelected[i] + cards[cnt]
                }
            }
        }
        cnt++
    }
    return 0
};

```
