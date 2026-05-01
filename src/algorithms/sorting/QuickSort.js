/**
 * Quick Sort Algorithm
 * 
 * Quick Sort is a highly efficient, divide-and-conquer sorting algorithm.
 * It works by selecting a pivot element and partitioning the array around it.
 * 
 * How it works:
 * 1. Select a pivot element
 * 2. Partition the array so that:
 *    - Elements less than pivot are on the left
 *    - Elements greater than pivot are on the right
 * 3. Recursively sort the left and right subarrays
 * 
 * Time Complexity:
 * - Best Case: O(n log n) - balanced partitions
 * - Average Case: O(n log n)
 * - Worst Case: O(n²) - pivot is always smallest/largest
 * 
 * Space Complexity: O(log n) - due to recursion stack
 * 
 * Characteristics:
 * - In-place sort (with extra stack space for recursion)
 * - Not stable
 * - Comparison-based
 * - Very efficient in practice
 * 
 * Use cases:
 * - General-purpose sorting
 * - Large datasets
 * - When average performance is critical
 */

/**
 * Quick Sort - Main function
 * @param {number[]} arr - Array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 * Time Complexity: O(n log n) average
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition and get pivot index
    const pi = partition(arr, low, high);
    
    // Recursively sort left and right subarrays
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  
  return arr;
}

/**
 * Partition function using Lomuto partition scheme
 * @param {number[]} arr - Array to partition
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} - Pivot index
 * Time Complexity: O(n)
 */
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

/**
 * Quick Sort with Hoare partition scheme
 * More efficient than Lomuto partition
 * 
 * @param {number[]} arr - Array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 */
function quickSortHoare(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partitionHoare(arr, low, high);
    
    quickSortHoare(arr, low, pi);
    quickSortHoare(arr, pi + 1, high);
  }
  
  return arr;
}

/**
 * Hoare partition scheme
 * @param {number[]} arr - Array
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} - Partition index
 */
function partitionHoare(arr, low, high) {
  const pivot = arr[low];
  let i = low - 1;
  let j = high + 1;
  
  while (true) {
    do {
      i++;
    } while (arr[i] < pivot);
    
    do {
      j--;
    } while (arr[j] > pivot);
    
    if (i >= j) {
      return j;
    }
    
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Quick Sort with Random Pivot selection
 * Helps avoid worst case when input is nearly sorted
 * 
 * @param {number[]} arr - Array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 */
function quickSortRandom(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partitionRandom(arr, low, high);
    
    quickSortRandom(arr, low, pi - 1);
    quickSortRandom(arr, pi + 1, high);
  }
  
  return arr;
}

/**
 * Partition with random pivot selection
 */
function partitionRandom(arr, low, high) {
  // Random index between low and high
  const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
  
  // Swap random element with last element
  [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
  
  return partition(arr, low, high);
}

/**
 * Quick Sort in Descending Order
 * @param {number[]} arr - Array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array in descending order
 */
function quickSortDescending(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partitionDescending(arr, low, high);
    
    quickSortDescending(arr, low, pi - 1);
    quickSortDescending(arr, pi + 1, high);
  }
  
  return arr;
}

/**
 * Partition for descending order
 */
function partitionDescending(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] > pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Example usage
if (require.main === module) {
  console.log('=== Quick Sort Algorithm ===\n');
  
  // Example 1: Basic Quick Sort
  console.log('1. Basic Quick Sort:');
  const arr1 = [64, 34, 25, 12, 22, 11, 90];
  console.log('Original:', arr1);
  console.log('Sorted:', quickSort([...arr1]));
  
  // Example 2: Hoare Partition
  console.log('\n2. Quick Sort with Hoare Partition:');
  const arr2 = [3, 7, 8, 5, 2, 1, 9, 5];
  console.log('Original:', arr2);
  console.log('Sorted:', quickSortHoare([...arr2]));
  
  // Example 3: Random Pivot
  console.log('\n3. Quick Sort with Random Pivot:');
  const arr3 = [10, 7, 8, 9, 1, 5];
  console.log('Original:', arr3);
  console.log('Sorted:', quickSortRandom([...arr3]));
  
  // Example 4: Descending Order
  console.log('\n4. Descending Order:');
  const arr4 = [5, 2, 8, 1, 9];
  console.log('Original:', arr4);
  console.log('Sorted (Descending):', quickSortDescending([...arr4]));
  
  // Example 5: Large Array
  console.log('\n5. Large Array Performance:');
  const arr5 = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
  console.log('Array size:', arr5.length);
  const sorted = quickSort([...arr5]);
  console.log('First 10 elements after sort:', sorted.slice(0, 10));
  console.log('Last 10 elements after sort:', sorted.slice(-10));
}

module.exports = { quickSort, quickSortHoare, quickSortRandom, quickSortDescending };
