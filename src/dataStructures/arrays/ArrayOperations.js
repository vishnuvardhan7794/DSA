/**
 * Array Data Structure Operations
 * 
 * Array is a collection of elements stored at contiguous memory locations.
 * It is the most widely used data structure in programming.
 * 
 * Time Complexity:
 * - Access: O(1)
 * - Search: O(n)
 * - Insertion: O(n)
 * - Deletion: O(n)
 * 
 * Space Complexity: O(n)
 */

/**
 * Linear Search - Find an element in an unsorted array
 * @param {number[]} arr - Input array
 * @param {number} target - Element to find
 * @returns {number} - Index of element or -1 if not found
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

/**
 * Reverse an Array
 * @param {*[]} arr - Input array
 * @returns {*[]} - Reversed array
 * Time Complexity: O(n)
 * Space Complexity: O(1) - In-place reversal
 */
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    // Swap elements
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  
  return arr;
}

/**
 * Find the maximum element in an array
 * @param {number[]} arr - Input array
 * @returns {number} - Maximum element
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function findMax(arr) {
  if (arr.length === 0) return null;
  
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

/**
 * Find the minimum element in an array
 * @param {number[]} arr - Input array
 * @returns {number} - Minimum element
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function findMin(arr) {
  if (arr.length === 0) return null;
  
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
  }
  return min;
}

/**
 * Rotate Array by k positions
 * @param {number[]} arr - Input array
 * @param {number} k - Number of positions to rotate
 * @returns {number[]} - Rotated array
 * Time Complexity: O(n)
 * Space Complexity: O(1) - In-place rotation
 */
function rotateArray(arr, k) {
  const n = arr.length;
  k = k % n; // Handle k > n
  
  // Reverse first k elements
  reverse(arr, 0, k - 1);
  // Reverse remaining elements
  reverse(arr, k, n - 1);
  // Reverse entire array
  reverse(arr, 0, n - 1);
  
  return arr;
}

/**
 * Helper function to reverse array from index start to end
 */
function reverse(arr, start, end) {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}

/**
 * Remove duplicates from sorted array
 * @param {number[]} arr - Sorted input array
 * @returns {number} - Length of array with unique elements
 * Time Complexity: O(n)
 * Space Complexity: O(1) - In-place
 */
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;
  
  let uniqueIndex = 0;
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[uniqueIndex]) {
      uniqueIndex++;
      arr[uniqueIndex] = arr[i];
    }
  }
  
  return uniqueIndex + 1;
}

/**
 * Find pair with given sum in array
 * @param {number[]} arr - Input array
 * @param {number} target - Target sum
 * @returns {number[]|null} - Pair [a, b] or null if not found
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function findPairWithSum(arr, target) {
  const seen = new Set();
  
  for (let num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      return [complement, num];
    }
    seen.add(num);
  }
  
  return null;
}

/**
 * Move all zeros to the end
 * @param {number[]} arr - Input array
 * @returns {number[]} - Array with zeros moved to end
 * Time Complexity: O(n)
 * Space Complexity: O(1) - In-place
 */
function moveZeroes(arr) {
  let nonZeroIndex = 0;
  
  // Move all non-zero elements to front
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[nonZeroIndex], arr[i]] = [arr[i], arr[nonZeroIndex]];
      nonZeroIndex++;
    }
  }
  
  return arr;
}

/**
 * Find second largest element
 * @param {number[]} arr - Input array
 * @returns {number|null} - Second largest element
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function findSecondLargest(arr) {
  if (arr.length < 2) return null;
  
  let max = -Infinity;
  let secondMax = -Infinity;
  
  for (let num of arr) {
    if (num > max) {
      secondMax = max;
      max = num;
    } else if (num > secondMax && num !== max) {
      secondMax = num;
    }
  }
  
  return secondMax === -Infinity ? null : secondMax;
}

// Example usage
if (require.main === module) {
  console.log('=== Array Operations ===\n');
  
  const arr = [5, 2, 8, 2, 9, 1, 5, 5];
  console.log('Original Array:', arr);
  
  console.log('\n1. Linear Search:');
  console.log('Search for 8:', linearSearch(arr, 8));
  console.log('Search for 10:', linearSearch(arr, 10));
  
  console.log('\n2. Find Max & Min:');
  console.log('Max:', findMax(arr));
  console.log('Min:', findMin(arr));
  
  console.log('\n3. Reverse Array:');
  const arr2 = [1, 2, 3, 4, 5];
  console.log('Original:', arr2);
  console.log('Reversed:', reverseArray([...arr2]));
  
  console.log('\n4. Rotate Array by 2:');
  const arr3 = [1, 2, 3, 4, 5];
  console.log('Original:', arr3);
  console.log('Rotated:', rotateArray([...arr3], 2));
  
  console.log('\n5. Find Pair with Sum:');
  console.log('Array:', [1, 5, 7, -1, 5]);
  console.log('Pair with sum 6:', findPairWithSum([1, 5, 7, -1, 5], 6));
  
  console.log('\n6. Move Zeroes:');
  const arr4 = [0, 1, 0, 3, 12];
  console.log('Original:', arr4);
  console.log('Zeroes moved:', moveZeroes([...arr4]));
  
  console.log('\n7. Second Largest:');
  console.log('Array:', [10, 20, 5, 40, 30]);
  console.log('Second Largest:', findSecondLargest([10, 20, 5, 40, 30]));
}

module.exports = {
  linearSearch,
  reverseArray,
  findMax,
  findMin,
  rotateArray,
  removeDuplicates,
  findPairWithSum,
  moveZeroes,
  findSecondLargest
};
