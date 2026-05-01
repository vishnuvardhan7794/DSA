/**
 * Top Asked LeetCode Problems
 * 
 * This file contains solutions for the most frequently asked LeetCode problems
 * across interviews and coding challenges.
 */

/**
 * LeetCode 1: Two Sum
 * Given an array of integers nums and an integer target, return the indices of the two numbers
 * that add up to target. You may assume each input has exactly one solution.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @returns {number[]} - Indices of two numbers
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}

/**
 * LeetCode 3: Longest Substring Without Repeating Characters
 * Given a string s, find the length of the longest substring without repeating characters.
 * 
 * @param {string} s - Input string
 * @returns {number} - Length of longest substring
 * Time Complexity: O(n)
 * Space Complexity: O(min(n, m)) where m is charset size
 */
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    if (charIndex.has(s[right])) {
      left = Math.max(left, charIndex.get(s[right]) + 1);
    }
    charIndex.set(s[right], right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

/**
 * LeetCode 5: Longest Palindromic Substring
 * Given a string s, return the longest palindromic substring in s.
 * 
 * @param {string} s - Input string
 * @returns {string} - Longest palindromic substring
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function longestPalindrome(s) {
  if (s.length < 2) return s;
  
  let start = 0;
  let maxLen = 1;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1; // Length of palindrome
  }
  
  for (let i = 0; i < s.length; i++) {
    const len1 = expandAroundCenter(i, i);
    const len2 = expandAroundCenter(i, i + 1);
    const len = Math.max(len1, len2);
    
    if (len > maxLen) {
      maxLen = len;
      start = i - Math.floor((len - 1) / 2);
    }
  }
  
  return s.substring(start, start + maxLen);
}

/**
 * LeetCode 20: Valid Parentheses
 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid.
 * 
 * @param {string} s - Input string
 * @returns {boolean} - True if valid, false otherwise
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValidParentheses(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let char of s) {
    if (pairs[char]) {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}

/**
 * LeetCode 21: Merge Two Sorted Lists
 * Merge two sorted linked lists and return it as a new list.
 * 
 * @param {ListNode} list1 - First sorted linked list
 * @param {ListNode} list2 - Second sorted linked list
 * @returns {ListNode} - Merged sorted linked list
 * Time Complexity: O(n + m)
 * Space Complexity: O(1)
 */
function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  
  current.next = list1 || list2;
  
  return dummy.next;
}

/**
 * LeetCode 53: Maximum Subarray (Kadane's Algorithm)
 * Given an integer array nums, find the contiguous subarray with the largest sum.
 * 
 * @param {number[]} nums - Array of integers
 * @returns {number} - Maximum sum of subarray
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function maxSubArray(nums) {
  let maxCurrent = nums[0];
  let maxGlobal = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
    maxGlobal = Math.max(maxGlobal, maxCurrent);
  }
  
  return maxGlobal;
}

/**
 * LeetCode 121: Best Time to Buy and Sell Stock
 * You are given an array prices where prices[i] is the price on day i.
 * Find maximum profit from buying and selling once.
 * 
 * @param {number[]} prices - Array of prices
 * @returns {number} - Maximum profit
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function maxProfit(prices) {
  if (prices.length < 2) return 0;
  
  let minPrice = prices[0];
  let maxProfit = 0;
  
  for (let i = 1; i < prices.length; i++) {
    const profit = prices[i] - minPrice;
    maxProfit = Math.max(maxProfit, profit);
    minPrice = Math.min(minPrice, prices[i]);
  }
  
  return maxProfit;
}

/**
 * LeetCode 125: Valid Palindrome
 * Given a string s, determine if it is a palindrome, considering only alphanumeric
 * characters and ignoring cases.
 * 
 * @param {string} s - Input string
 * @returns {boolean} - True if valid palindrome, false otherwise
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    while (left < right && !isAlphaNumeric(s[left])) {
      left++;
    }
    while (left < right && !isAlphaNumeric(s[right])) {
      right--;
    }
    
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    
    left++;
    right--;
  }
  
  return true;
}

function isAlphaNumeric(char) {
  return /[a-zA-Z0-9]/.test(char);
}

/**
 * LeetCode 206: Reverse Linked List
 * Reverse a singly linked list.
 * 
 * @param {ListNode} head - Head of the linked list
 * @returns {ListNode} - Reversed linked list head
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  
  return prev;
}

/**
 * LeetCode 217: Contains Duplicate
 * Given an integer array nums, return true if any value appears at least twice
 * in the array, and return false if every element is distinct.
 * 
 * @param {number[]} nums - Array of integers
 * @returns {boolean} - True if contains duplicate, false otherwise
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function containsDuplicate(nums) {
  const seen = new Set();
  
  for (let num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  
  return false;
}

/**
 * LeetCode 242: Valid Anagram
 * Given two strings s and t, return true if t is an anagram of s, and false otherwise.
 * 
 * @param {string} s - First string
 * @param {string} t - Second string
 * @returns {boolean} - True if anagram, false otherwise
 * Time Complexity: O(n)
 * Space Complexity: O(1) - At most 26 letters
 */
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const charCount = {};
  
  for (let char of s) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  for (let char of t) {
    if (!charCount[char]) return false;
    charCount[char]--;
  }
  
  return true;
}

/**
 * LeetCode 46: Permutations
 * Given an array nums of distinct integers, return all the permutations.
 * 
 * @param {number[]} nums - Array of distinct integers
 * @returns {number[][]} - All permutations
 * Time Complexity: O(n! * n)
 * Space Complexity: O(n!)
 */
function permute(nums) {
  const result = [];
  
  function backtrack(current) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    
    for (let num of nums) {
      if (!current.includes(num)) {
        current.push(num);
        backtrack(current);
        current.pop();
      }
    }
  }
  
  backtrack([]);
  return result;
}

/**
 * LeetCode 70: Climbing Stairs
 * You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps.
 * In how many distinct ways can you climb to the top?
 * 
 * @param {number} n - Number of steps
 * @returns {number} - Number of distinct ways
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function climbStairs(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  
  let prev1 = 1;
  let prev2 = 2;
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev1 = prev2;
    prev2 = current;
  }
  
  return prev2;
}

/**
 * LeetCode 141: Linked List Cycle
 * Given the head of a linked list, determine if the linked list has a cycle in it.
 * 
 * @param {ListNode} head - Head of the linked list
 * @returns {boolean} - True if cycle exists, false otherwise
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head.next;
  
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return true;
}

// ListNode definition for linked list problems
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Example usage
if (require.main === module) {
  console.log('=== Top LeetCode Problems ===\n');
  
  console.log('1. Two Sum:');
  console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
  
  console.log('\n2. Longest Substring Without Repeating Characters:');
  console.log(lengthOfLongestSubstring('abcabcbb')); // 3
  
  console.log('\n3. Longest Palindromic Substring:');
  console.log(longestPalindrome('babad')); // "bab" or "aba"
  
  console.log('\n4. Valid Parentheses:');
  console.log(isValidParentheses('()')); // true
  console.log(isValidParentheses('([)]')); // false
  
  console.log('\n5. Maximum Subarray:');
  console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
  
  console.log('\n6. Best Time to Buy and Sell Stock:');
  console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
  
  console.log('\n7. Valid Palindrome:');
  console.log(isPalindrome('A man, a plan, a canal: Panama')); // true
  
  console.log('\n8. Contains Duplicate:');
  console.log(containsDuplicate([1, 2, 3, 1])); // true
  
  console.log('\n9. Valid Anagram:');
  console.log(isAnagram('anagram', 'nagaram')); // true
  
  console.log('\n10. Climbing Stairs:');
  console.log(climbStairs(5)); // 8
}

module.exports = {
  twoSum,
  lengthOfLongestSubstring,
  longestPalindrome,
  isValidParentheses,
  mergeTwoLists,
  maxSubArray,
  maxProfit,
  isPalindrome,
  reverseList,
  containsDuplicate,
  isAnagram,
  permute,
  climbStairs,
  hasCycle,
  ListNode
};
