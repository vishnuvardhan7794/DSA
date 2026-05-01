/**
 * React Most Important Interview Questions & Solutions
 * 
 * This file contains the most frequently asked React interview questions
 * with detailed explanations and code examples.
 */

// =====================================================
// 1. WHAT IS REACT?
// =====================================================
/**
 * React is a JavaScript library for building user interfaces using reusable components.
 * It uses a virtual DOM for efficient rendering and follows a component-based architecture.
 * 
 * Key Features:
 * - Component-Based: Build encapsulated components that manage their own state
 * - Declarative: Design simple views for each state in your application
 * - Learn Once, Write Anywhere: Develop new features without rewriting existing code
 */

// =====================================================
// 2. FUNCTIONAL VS CLASS COMPONENTS
// =====================================================

/**
 * Class Component Example
 * - Older way of writing components
 * - Uses lifecycle methods (componentDidMount, componentDidUpdate, etc.)
 * - Has access to 'this' keyword
 */
class ClassComponentExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Component updated');
  }

  render() {
    return (
      <div>
        <h2>Class Component</h2>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}

/**
 * Functional Component Example
 * - Modern way of writing components
 * - Uses Hooks for state and side effects
 * - Simpler and more intuitive
 */
function FunctionalComponentExample() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log('Component mounted or updated');
    return () => console.log('Cleanup');
  }, [count]);

  return (
    <div>
      <h2>Functional Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// =====================================================
// 3. HOOKS - useState, useEffect, useContext
// =====================================================

/**
 * useState Hook
 * - Manages state in functional components
 * - Returns [state, setState] pair
 */
function UseStateExample() {
  const [name, setName] = React.useState('John');
  const [age, setAge] = React.useState(25);

  return (
    <div>
      <h3>useState Example</h3>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setAge(age + 1)}>Increase Age</button>
    </div>
  );
}

/**
 * useEffect Hook
 * - Handles side effects (API calls, subscriptions, DOM updates)
 * - Replaces lifecycle methods: componentDidMount, componentDidUpdate, componentWillUnmount
 * - Dependency array controls when effect runs
 */
function UseEffectExample() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Runs on mount and when dependencies change
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function (runs on unmount)
    return () => {
      console.log('Cleanup on unmount');
    };
  }, []); // Empty dependency array = runs only on mount

  if (loading) return <p>Loading...</p>;
  return <div>{data ? JSON.stringify(data) : 'No data'}</div>;
}

/**
 * useContext Hook
 * - Avoids prop drilling
 * - Shares data across components without passing props manually
 */
const ThemeContext = React.createContext('light');

function UseContextExample() {
  const [theme, setTheme] = React.useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
        <ChildComponent />
      </div>
    </ThemeContext.Provider>
  );
}

function ChildComponent() {
  const theme = React.useContext(ThemeContext);
  return <p>Current theme: {theme}</p>;
}

// =====================================================
// 4. CUSTOM HOOKS
// =====================================================

/**
 * Custom Hook Example - useForm
 * - Encapsulates form logic
 * - Reusable across components
 */
function useForm(initialState) {
  const [values, setValues] = React.useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const resetForm = () => {
    setValues(initialState);
  };

  return { values, handleChange, resetForm };
}

function FormComponent() {
  const { values, handleChange, resetForm } = useForm({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', values);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={resetForm}>Reset</button>
    </form>
  );
}

// =====================================================
// 5. PROPS vs STATE
// =====================================================

/**
 * Props:
 * - Read-only data passed from parent to child
 * - Cannot be modified by child component
 * - Used for static data and callbacks
 * 
 * State:
 * - Mutable data owned by the component
 * - Can be changed using setState (class) or setters (hooks)
 * - Re-renders component when changed
 */

function PropsVsStateExample() {
  const [counter, setCounter] = React.useState(0);

  return (
    <div>
      <h3>Props vs State</h3>
      <ParentComponent title="Parent Component" counter={counter} />
      <button onClick={() => setCounter(counter + 1)}>
        Increment Parent State: {counter}
      </button>
    </div>
  );
}

function ParentComponent({ title, counter }) {
  return (
    <div>
      <h4>{title}</h4>
      <p>Props received: {counter}</p>
      <ChildComponentWithState />
    </div>
  );
}

function ChildComponentWithState() {
  const [localState, setLocalState] = React.useState(0);
  return (
    <div>
      <p>Child State: {localState}</p>
      <button onClick={() => setLocalState(localState + 1)}>
        Increment Child
      </button>
    </div>
  );
}

// =====================================================
// 6. CONTROLLED vs UNCONTROLLED COMPONENTS
// =====================================================

/**
 * Controlled Component
 * - Form data is handled by React state
 * - Single source of truth
 * - Recommended approach
 */
function ControlledComponent() {
  const [input, setInput] = React.useState('');

  return (
    <div>
      <h4>Controlled Input</h4>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <p>Value: {input}</p>
    </div>
  );
}

/**
 * Uncontrolled Component
 * - Form data is handled by the DOM
 * - Uses refs to access values
 * - Less common, used in specific scenarios
 */
function UncontrolledComponent() {
  const inputRef = React.useRef(null);

  const handleSubmit = () => {
    console.log('Input value:', inputRef.current.value);
  };

  return (
    <div>
      <h4>Uncontrolled Input</h4>
      <input type="text" ref={inputRef} />
      <button onClick={handleSubmit}>Get Value</button>
    </div>
  );
}

// =====================================================
// 7. RENDERING & RECONCILIATION (Virtual DOM)
// =====================================================

/**
 * React Virtual DOM:
 * - In-memory representation of the UI
 * - React compares new virtual DOM with previous (diffing)
 * - Only updates changed elements (reconciliation)
 * - More efficient than direct DOM manipulation
 * 
 * Key Points:
 * - Keys: Help React identify which items have changed
 * - Reconciliation: Algorithm that determines what changed
 * - Batching: React batches multiple state updates
 */

function ListWithKeys() {
  const [items, setItems] = React.useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), text: `Item ${items.length + 1}` }]);
  };

  return (
    <div>
      <h4>List with Keys</h4>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

// =====================================================
// 8. CONDITIONAL RENDERING
// =====================================================

function ConditionalRenderingExample() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Method 1: if/else
  if (isLoggedIn) {
    return <div>Welcome back!</div>;
  }

  // Method 2: Ternary operator
  return (
    <div>
      {isLoggedIn ? (
        <p>User is logged in</p>
      ) : (
        <p>User is logged out</p>
      )}

      {/* Method 3: Logical && operator */}
      {!isLoggedIn && <button onClick={() => setIsLoggedIn(true)}>Login</button>}

      {/* Method 4: Switch */}
      {(() => {
        switch (isLoggedIn) {
          case true:
            return <p>Logged in</p>;
          case false:
            return <p>Not logged in</p>;
          default:
            return null;
        }
      })()}
    </div>
  );
}

// =====================================================
// 9. EVENT HANDLING
// =====================================================

function EventHandlingExample() {
  const [message, setMessage] = React.useState('');

  // Method 1: Inline arrow function
  const handleClick1 = () => {
    setMessage('Button 1 clicked');
  };

  // Method 2: Binding in constructor (class component way)
  const handleClick2 = (e) => {
    setMessage(`Event: ${e.type}`);
  };

  // Method 3: Passing arguments
  const handleClick3 = (id) => {
    setMessage(`Button ${id} clicked`);
  };

  return (
    <div>
      <h4>Event Handling</h4>
      <button onClick={handleClick1}>Click 1</button>
      <button onClick={handleClick2}>Click 2</button>
      <button onClick={() => handleClick3(3)}>Click 3</button>
      <p>{message}</p>
    </div>
  );
}

// =====================================================
// 10. LIST RENDERING
// =====================================================

function ListRenderingExample() {
  const items = [
    { id: 1, name: 'Apple', price: 1.5 },
    { id: 2, name: 'Banana', price: 0.5 },
    { id: 3, name: 'Orange', price: 2.0 }
  ];

  return (
    <div>
      <h4>List Rendering</h4>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>

      {/* Nested lists */}
      {items.map((item) => (
        <div key={item.id}>
          <h5>{item.name}</h5>
          <ul>
            <li>Price: ${item.price}</li>
            <li>ID: {item.id}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// 11. FORMS HANDLING
// =====================================================

function FormHandlingExample() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    country: '',
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      country: '',
      terms: false
    });
  };

  return (
    <div>
      <h4>Form Handling</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <select name="country" value={formData.country} onChange={handleChange}>
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="India">India</option>
        </select>
        <label>
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          Agree to terms
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// =====================================================
// 12. COMPONENT LIFECYCLE (Class Components)
// =====================================================

/**
 * Component Lifecycle Phases:
 * 
 * 1. MOUNTING: Component is being created and inserted into the DOM
 *    - constructor()
 *    - render()
 *    - componentDidMount()
 * 
 * 2. UPDATING: Component is being re-rendered as a result of changes to props or state
 *    - render()
 *    - componentDidUpdate()
 * 
 * 3. UNMOUNTING: Component is being removed from the DOM
 *    - componentWillUnmount()
 */

class LifecycleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log('1. Constructor called');
  }

  componentDidMount() {
    console.log('2. Component mounted');
    // Perfect place for API calls, subscriptions
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('3. Component updated');
    console.log('Previous state:', prevState);
    console.log('Current state:', this.state);
  }

  componentWillUnmount() {
    console.log('4. Component will unmount');
    // Perfect place for cleanup (unsubscribe, timers)
  }

  render() {
    console.log('Render called');
    return (
      <div>
        <h4>Lifecycle Example</h4>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}

// =====================================================
// 13. COMPOSITION & REUSABILITY
// =====================================================

/**
 * Higher-Order Component (HOC)
 * - Advanced pattern for reusing component logic
 * - A function that takes a component and returns an enhanced component
 */
function withLogger(WrappedComponent) {
  return (props) => {
    React.useEffect(() => {
      console.log(`Component ${WrappedComponent.name} mounted`);
      return () => console.log(`Component ${WrappedComponent.name} unmounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };
}

function SimpleComponent() {
  return <h4>Simple Component wrapped with Logger HOC</h4>;
}

const EnhancedComponent = withLogger(SimpleComponent);

/**
 * Render Props Pattern
 * - Technique for sharing code between React components
 * - A component with a render prop that returns JSX
 */
function RenderPropsExample() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h4>Render Props Pattern</h4>
      <Counter
        render={(count, increment) => (
          <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
          </div>
        )}
      />
    </div>
  );
}

function Counter({ render }) {
  const [count, setCount] = React.useState(0);
  return render(count, () => setCount(count + 1));
}

/**
 * Compound Components Pattern
 * - Components that work together to manage state
 */
function Tabs() {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <h4>Compound Components</h4>
      <div>
        <TabButton index={0} isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
          Tab 1
        </TabButton>
        <TabButton index={1} isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
          Tab 2
        </TabButton>
      </div>
      <div>
        {activeTab === 0 && <TabContent>Content 1</TabContent>}
        {activeTab === 1 && <TabContent>Content 2</TabContent>}
      </div>
    </div>
  );
}

function TabButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: isActive ? '#007bff' : '#fff',
        color: isActive ? '#fff' : '#000'
      }}
    >
      {children}
    </button>
  );
}

function TabContent({ children }) {
  return <div style={{ padding: '10px', border: '1px solid #ccc' }}>{children}</div>;
}

// =====================================================
// 14. PERFORMANCE OPTIMIZATION
// =====================================================

/**
 * React.memo - Prevent unnecessary re-renders
 * - Shallow comparison of props
 * - Only re-render if props change
 */
const UserCard = React.memo(function UserCard({ user }) {
  console.log('UserCard rendered');
  return (
    <div>
      <h5>{user.name}</h5>
      <p>{user.email}</p>
    </div>
  );
});

/**
 * useMemo - Memoize expensive computations
 * - Only recalculate when dependencies change
 */
function UseMemoExample() {
  const [count, setCount] = React.useState(0);
  const [input, setInput] = React.useState('');

  const expensiveCalculation = React.useMemo(() => {
    console.log('Expensive calculation running...');
    return count * 2;
  }, [count]);

  return (
    <div>
      <h4>useMemo Example</h4>
      <p>Count: {count}</p>
      <p>Expensive Result: {expensiveCalculation}</p>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  );
}

/**
 * useCallback - Memoize function references
 * - Prevents child re-renders when parent re-renders
 * - Important for useEffect dependencies
 */
function UseCallbackExample() {
  const [count, setCount] = React.useState(0);

  const handleCallback = React.useCallback(() => {
    console.log('Callback executed with count:', count);
  }, [count]);

  return (
    <div>
      <h4>useCallback Example</h4>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildWithCallback onCallback={handleCallback} />
    </div>
  );
}

const ChildWithCallback = React.memo(({ onCallback }) => {
  console.log('Child rendered');
  return <button onClick={onCallback}>Call Parent Function</button>;
});

// =====================================================
// 15. ERROR BOUNDARIES
// =====================================================

/**
 * Error Boundary
 * - Catches errors in child components
 * - Prevents entire app from crashing
 * - Only works with class components
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c33' }}>
          <h4>Something went wrong</h4>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function BuggyComponent() {
  throw new Error('This component has an error!');
}

// =====================================================
// 16. SIDE EFFECTS AND CLEANUP
// =====================================================

function SideEffectExample() {
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  React.useEffect(() => {
    if (isSubscribed) {
      console.log('Subscribing to events...');

      const handleEvent = () => {
        console.log('Event received');
      };

      // Subscribe
      window.addEventListener('resize', handleEvent);

      // Cleanup function - runs before effect runs again or component unmounts
      return () => {
        console.log('Unsubscribing from events...');
        window.removeEventListener('resize', handleEvent);
      };
    }
  }, [isSubscribed]);

  return (
    <div>
      <h4>Side Effects & Cleanup</h4>
      <button onClick={() => setIsSubscribed(!isSubscribed)}>
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
      <p>Status: {isSubscribed ? 'Subscribed' : 'Unsubscribed'}</p>
    </div>
  );
}

// =====================================================
// 17. USEREF HOOK
// =====================================================

/**
 * useRef - Access DOM nodes directly
 * - Persists across re-renders
 * - Doesn't cause re-renders when changed
 * - Use cases: managing focus, selecting text, triggering animations
 */
function UseRefExample() {
  const inputRef = React.useRef(null);
  const countRef = React.useRef(0);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  const handleIncrement = () => {
    countRef.current++;
    console.log('Ref count:', countRef.current);
    // Note: This doesn't trigger re-render
  };

  return (
    <div>
      <h4>useRef Example</h4>
      <input ref={inputRef} type="text" placeholder="Click button to focus" />
      <button onClick={handleFocus}>Focus Input</button>
      <button onClick={handleIncrement}>Increment Ref (check console)</button>
    </div>
  );
}

// =====================================================
// 18. LAZY LOADING & CODE SPLITTING
// =====================================================

/**
 * React.lazy & Suspense
 * - Load components dynamically
 * - Code splitting for better performance
 */
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function LazyLoadingExample() {
  return (
    <div>
      <h4>Lazy Loading Example</h4>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    </div>
  );
}

// =====================================================
// 19. COMMON INTERVIEW QUESTIONS & ANSWERS
// =====================================================

/**
 * Q1: What is the difference between state and props?
 * A: 
 * - Props: Read-only, passed from parent to child
 * - State: Mutable, managed by the component itself
 * 
 * Q2: What is the virtual DOM?
 * A: In-memory representation of actual DOM. React uses it for efficient updates.
 * 
 * Q3: What are controlled components?
 * A: Form elements whose value is controlled by React state
 * 
 * Q4: What is prop drilling?
 * A: Passing props through multiple layers of components
 * Solution: Use Context API or state management libraries
 * 
 * Q5: What are keys in lists?
 * A: Unique identifiers that help React identify which items changed, added, or removed
 * 
 * Q6: What is useCallback?
 * A: Hook to memoize function references and prevent unnecessary re-renders
 * 
 * Q7: What is useReducer?
 * A: Hook for complex state logic, similar to Redux
 * 
 * Q8: What is Context API?
 * A: API for sharing state without prop drilling
 * 
 * Q9: What is the difference between useEffect and useLayoutEffect?
 * A: 
 * - useEffect: Runs after render (async)
 * - useLayoutEffect: Runs before paint (sync)
 * 
 * Q10: How to optimize React performance?
 * A: 
 * - Use React.memo
 * - Use useMemo for expensive calculations
 * - Use useCallback for functions
 * - Code splitting with lazy loading
 * - Production build optimization
 */

// =====================================================
// 20. BEST PRACTICES
// =====================================================

/**
 * React Best Practices:
 * 
 * 1. Prefer functional components and hooks
 * 2. Use meaningful component names
 * 3. Keep components small and focused
 * 4. Lift state up when needed
 * 5. Use key prop correctly in lists
 * 6. Avoid inline functions in render
 * 7. Clean up side effects
 * 8. Use PropTypes or TypeScript for type checking
 * 9. Separate concerns (UI, logic, styling)
 * 10. Write testable components
 * 11. Use error boundaries
 * 12. Optimize bundle size
 * 13. Monitor performance
 * 14. Document complex logic
 * 15. Follow naming conventions
 */

// =====================================================
// ADDITIONAL USEFUL PATTERNS
// =====================================================

/**
 * useReducer - State management for complex logic
 */
function UseReducerExample() {
  const initialState = { count: 0 };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      case 'RESET':
        return { count: 0 };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div>
      <h4>useReducer Example</h4>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

/**
 * useImperativeHandle - Expose component methods to parent
 */
const ImperativeInput = React.forwardRef((props, ref) => {
  const inputRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    getValue: () => inputRef.current.value
  }));

  return <input ref={inputRef} type="text" />;
});

function UseImperativeHandleExample() {
  const inputRef = React.useRef(null);

  return (
    <div>
      <h4>useImperativeHandle Example</h4>
      <ImperativeInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>
      <button onClick={() => console.log(inputRef.current.getValue())}>
        Get Value
      </button>
    </div>
  );
}

// =====================================================
// EXPORTS
// =====================================================

export {
  ClassComponentExample,
  FunctionalComponentExample,
  UseStateExample,
  UseEffectExample,
  UseContextExample,
  useForm,
  FormComponent,
  PropsVsStateExample,
  ControlledComponent,
  UncontrolledComponent,
  ListWithKeys,
  ConditionalRenderingExample,
  EventHandlingExample,
  ListRenderingExample,
  FormHandlingExample,
  LifecycleExample,
  EnhancedComponent,
  RenderPropsExample,
  Tabs,
  UseMemoExample,
  UseCallbackExample,
  ErrorBoundary,
  SideEffectExample,
  UseRefExample,
  UseReducerExample,
  UseImperativeHandleExample
};
