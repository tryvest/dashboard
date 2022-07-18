# import math
#
# def checkAll(subStr, strs, startingIndex):
#     print(subStr)
#     for word in strs:
#         if (word.find(subStr, startingIndex) != startingIndex):
#             return False
#     return True
#
# def asdf(subStr, strs, prefix):
#     print("Prefix: " + prefix)
#     if len(subStr) == 1:
#         if checkAll(subStr, strs, len(prefix)):
#             return prefix + subStr
#         return prefix
#     middle = math.ceil(len(subStr) / 2)
#     leftHalf = subStr[0:middle]
#     rightHalf = subStr[middle:len(subStr)]
#     print("Left Half: " + leftHalf)
#     print("Right Half: " + rightHalf)
#
#     if checkAll(leftHalf, strs, len(prefix)):
#         prefix += leftHalf
#         return asdf(rightHalf, strs, prefix)
#     else:
#         return asdf(leftHalf, strs, prefix)
#
# def longestCommonPrefix(strs) -> str:
#     return asdf(strs[0], strs, "")
#
# strs = ["leets", "leetcode", "leet", "leeds"]
# print(longestCommonPrefix(strs=strs))

def sortArray(nums):
    whichPlace = 1
    hasElements = True
    while hasElements:
        hasElements = False
        nodeArr = [Node(None) for _ in range(19)]
        for num in nums:
            multiplier = 1
            if num < 0:
                multiplier = -1
                num *= -1
            currentDigit = findDigit(num, whichPlace) * multiplier
            if currentDigit != 0:
                hasElements = True
            addNode(nodeArr[currentDigit + 9], Node(num * multiplier))
        whichPlace += 1
        nums = []
        for node in nodeArr:
            nums += returnFullListAsArr(node)
    return nums


class Node:
    def __init__(self, data):
        self.data = data
        self.nextNode = None


def returnFullListAsArr(node):
    returnArr = []
    while (node.nextNode is not None):
        returnArr.append(node.data)
        node = node.nextNode
    if(node.data is not None):
        returnArr.append(node.data)
    return returnArr


def addNode(node, addedNode):
    if node.data is None:
        node.data = addedNode.data
        return
    while node.nextNode is not None:
        node = node.nextNode
    node.nextNode = addedNode


def findDigit(num, place):
    if place == 1:
        return (num % 10)
    else:
        return findDigit(num // 10, place - 1)


nums = [-1,2,-8,-10]
print(sortArray(nums))
