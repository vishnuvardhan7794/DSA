/**
 * React Micro Frontend Architecture & Patterns
 * 
 * A Micro Frontend is an architectural style where a front-end app is decomposed
 * into semi-independent "micro" applications that work together.
 * 
 * Key Benefits:
 * - Scalability: Teams can work independently
 * - Technology Agnostic: Different frameworks in different micro frontends
 * - Independent Deployment: Deploy parts without affecting others
 * - Reusability: Share components across applications
 * - Isolation: Failures in one don't crash the entire app
 */

// =====================================================
// 1. MODULE FEDERATION (Webpack 5)
// =====================================================

/**
 * Module Federation allows loading components from remote applications
 * 
 * Configuration in webpack.config.js:
 * 
 * // Host Application (Shell)
 * new ModuleFederationPlugin({
 *   name: 'shell',
 *   filename: 'remoteEntry.js',
 *   remotes: {
 *     'auth': 'auth@http://localhost:3001/remoteEntry.js',
 *     'dashboard': 'dashboard@http://localhost:3002/remoteEntry.js',
 *     'profile': 'profile@http://localhost:3003/remoteEntry.js'
 *   },
 *   exposes: {
 *     './utils': './src/utils/index.js',
 *     './store': './src/store/index.js'
 *   },
 *   shared: ['react', 'react-dom']
 * })
 * 
 * // Remote Application (Auth Micro Frontend)
 * new ModuleFederationPlugin({
 *   name: 'auth',
 *   filename: 'remoteEntry.js',
 *   exposes: {
 *     './AuthModule': './src/AuthModule.js',
 *     './useAuth': './src/hooks/useAuth.js'
 *   },
 *   shared: ['react', 'react-dom']
 * })
 */

/**
 * Consuming Module Federation Components
 */
import React from 'react';

// Dynamically load remote component
const AuthModule = React.lazy(() => 
  import('auth/AuthModule').catch(() => {
    console.error('Failed to load Auth Module');
    return { default: () => <div>Auth Module Failed</div> };
  })
);

const DashboardModule = React.lazy(() =>
  import('dashboard/DashboardModule')
);

const ProfileModule = React.lazy(() =>
  import('profile/ProfileModule')
);

/**
 * Shell Application using Module Federation
 */
function ShellApp() {
  const [user, setUser] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState('auth');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Navigation */}
      <nav style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h3>Shell App</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <button 
              onClick={() => setCurrentPage('auth')}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            >
              Auth
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              disabled={!user}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('profile')}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              disabled={!user}
            >
              Profile
            </button>
          </li>
        </ul>
        {user && <p>Logged in as: {user.name}</p>}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        <React.Suspense fallback={<div>Loading...</div>}>
          {currentPage === 'auth' && (
            <AuthModule onLogin={setUser} />
          )}
          {currentPage === 'dashboard' && user && (
            <DashboardModule user={user} />
          )}
          {currentPage === 'profile' && user && (
            <ProfileModule user={user} onUpdate={setUser} />
          )}
        </React.Suspense>
      </main>
    </div>
  );
}

// =====================================================
// 2. IFRAME-BASED MICRO FRONTENDS
// =====================================================

/**
 * Using iframes for complete isolation
 * Pros: Complete isolation, different frameworks
 * Cons: Performance overhead, communication complexity
 */
function IframeContainer({ src, title, onMessage }) {
  const iframeRef = React.useRef(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event) => {
      // Verify origin for security
      if (event.origin !== 'http://localhost:3001') return;
      
      console.log('Message from iframe:', event.data);
      onMessage?.(event.data);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onMessage]);

  const sendMessage = (data) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(data, 'http://localhost:3001');
    }
  };

  return (
    <div>
      <h3>{title}</h3>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
        onLoad={() => setIsLoaded(true)}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
      {isLoaded && (
        <button onClick={() => sendMessage({ type: 'INIT', data: { token: 'abc123' } })}>
          Send Token
        </button>
      )}
    </div>
  );
}

/**
 * Parent component managing multiple iframes
 */
function IframeMicroFrontendApp() {
  const [messages, setMessages] = React.useState([]);

  const handleIframeMessage = (data) => {
    setMessages(prev => [...prev, data]);
  };

  return (
    <div>
      <h2>Iframe-Based Micro Frontends</h2>
      
      <IframeContainer
        src="http://localhost:3001/auth"
        title="Auth Module"
        onMessage={handleIframeMessage}
      />

      <IframeContainer
        src="http://localhost:3002/dashboard"
        title="Dashboard Module"
        onMessage={handleIframeMessage}
      />

      <div>
        <h3>Messages Log</h3>
        <pre>{JSON.stringify(messages, null, 2)}</pre>
      </div>
    </div>
  );
}

// =====================================================
// 3. EVENT-BASED COMMUNICATION (PubSub)
// =====================================================

/**
 * Global Event Bus for micro frontend communication
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, handler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);

    // Return unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(h => h !== handler);
    };
  }

  off(eventName, handler) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(h => h !== handler);
    }
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(handler => {
        handler(data);
      });
    }
  }

  once(eventName, handler) {
    const wrappedHandler = (data) => {
      handler(data);
      this.off(eventName, wrappedHandler);
    };
    this.on(eventName, wrappedHandler);
  }
}

// Global instance
export const eventBus = new EventBus();

/**
 * Custom hook for event bus
 */
function useEventBus(eventName, handler) {
  React.useEffect(() => {
    const unsubscribe = eventBus.on(eventName, handler);
    return unsubscribe;
  }, [eventName, handler]);
}

/**
 * Auth Micro Frontend with Event Bus
 */
function AuthMicroFrontend() {
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    const userData = { id: 1, email, name: email.split('@')[0] };
    setUser(userData);
    
    // Emit global login event
    eventBus.emit('user:login', userData);
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    
    // Emit global logout event
    eventBus.emit('user:logout');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h3>Auth Micro Frontend</h3>
      {!user ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: '10px', padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: '10px', padding: '8px' }}
          />
          <button onClick={handleLogin} style={{ padding: '8px 16px' }}>
            Login
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Dashboard Micro Frontend listening to events
 */
function DashboardMicroFrontend() {
  const [user, setUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEventBus('user:login', (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  });

  useEventBus('user:logout', () => {
    setUser(null);
    setIsLoggedIn(false);
  });

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
        <h3>Dashboard</h3>
        <p>Please login to view dashboard</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h3>Dashboard</h3>
      <p>User: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <div style={{ marginTop: '20px' }}>
        <h4>Stats</h4>
        <p>Active Users: 1,234</p>
        <p>Total Revenue: $56,789</p>
      </div>
    </div>
  );
}

/**
 * Notifications Micro Frontend
 */
function NotificationsMicroFrontend() {
  const [notifications, setNotifications] = React.useState([]);

  useEventBus('user:login', (userData) => {
    setNotifications(prev => [
      ...prev,
      { id: Date.now(), message: `${userData.name} logged in`, type: 'info' }
    ]);
  });

  useEventBus('user:logout', () => {
    setNotifications(prev => [
      ...prev,
      { id: Date.now(), message: 'User logged out', type: 'info' }
    ]);
  });

  useEventBus('notification', (data) => {
    setNotifications(prev => [
      ...prev,
      { id: Date.now(), message: data.message, type: data.type || 'info' }
    ]);
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map(notif => (
            <li
              key={notif.id}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: notif.type === 'info' ? '#e3f2fd' : '#fff3e0',
                borderLeft: `4px solid ${notif.type === 'info' ? '#2196f3' : '#ff9800'}`
              }}
            >
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Event-Based Micro Frontends App
 */
function EventBasedMicroFrontendApp() {
  return (
    <div>
      <h2>Event-Based Micro Frontend Communication</h2>
      <AuthMicroFrontend />
      <DashboardMicroFrontend />
      <NotificationsMicroFrontend />
    </div>
  );
}

// =====================================================
// 4. SHARED STATE MANAGEMENT
// =====================================================

/**
 * Simple Redux-like store for micro frontends
 */
class MicroFrontendStore {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach(callback => callback(this.state));
  }

  dispatch(action, payload) {
    switch (action) {
      case 'SET_USER':
        this.setState({ user: payload });
        break;
      case 'CLEAR_USER':
        this.setState({ user: null });
        break;
      case 'SET_THEME':
        this.setState({ theme: payload });
        break;
      default:
        break;
    }
  }
}

export const microFrontendStore = new MicroFrontendStore({
  user: null,
  theme: 'light',
  notifications: []
});

/**
 * Hook to use shared store
 */
function useSharedStore() {
  const [state, setState] = React.useState(microFrontendStore.getState());

  React.useEffect(() => {
    const unsubscribe = microFrontendStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return [state, (action, payload) => microFrontendStore.dispatch(action, payload)];
}

/**
 * Component using shared store
 */
function SharedStoreComponent() {
  const [state, dispatch] = useSharedStore();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Shared Store Demo</h3>
      <p>Current Theme: {state.theme}</p>
      <p>User: {state.user ? state.user.name : 'Not logged in'}</p>
      
      <button
        onClick={() => dispatch('SET_THEME', state.theme === 'light' ? 'dark' : 'light')}
        style={{ marginRight: '10px', padding: '8px 16px' }}
      >
        Toggle Theme
      </button>
      
      <button
        onClick={() => dispatch('SET_USER', { id: 1, name: 'John Doe' })}
        style={{ marginRight: '10px', padding: '8px 16px' }}
      >
        Set User
      </button>
    </div>
  );
}

// =====================================================
// 5. WEB COMPONENTS INTEGRATION
// =====================================================

/**
 * React wrapper for Web Components
 */
function WebComponentWrapper({ tag, props = {}, children }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;

    // Set properties on Web Component
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') {
        ref.current.setAttribute('class', value);
      } else if (typeof value === 'function') {
        ref.current[key] = value;
      } else {
        ref.current.setAttribute(key, value);
      }
    });
  }, [props]);

  const Component = tag;
  return <Component ref={ref}>{children}</Component>;
}

/**
 * Example usage with custom Web Component
 * 
 * // Define Web Component
 * class MyCounter extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     this.count = 0;
 *   }
 *   
 *   connectedCallback() {
 *     this.render();
 *   }
 *   
 *   render() {
 *     this.shadowRoot.innerHTML = `
 *       <button>Count: ${this.count}</button>
 *       <style>
 *         button { padding: 8px 16px; }
 *       </style>
 *     `;
 *     this.shadowRoot.querySelector('button').onclick = () => {
 *       this.count++;
 *       this.render();
 *     };
 *   }
 * }
 * customElements.define('my-counter', MyCounter);
 */

function WebComponentIntegration() {
  return (
    <div>
      <h3>Web Component Integration</h3>
      <WebComponentWrapper tag="my-counter" />
    </div>
  );
}

// =====================================================
// 6. DYNAMIC LOADING WITH SCRIPT INJECTION
// =====================================================

/**
 * Dynamically load micro frontend from remote URL
 */
function loadMicroFrontend(scriptUrl) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script from ${scriptUrl}`));
    document.body.appendChild(script);
  });
}

/**
 * Container for dynamically loaded micro frontend
 */
function DynamicMicroFrontendContainer({ name, scriptUrl }) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    loadMicroFrontend(scriptUrl)
      .then(() => {
        setLoaded(true);
      })
      .catch((err) => {
        console.error(`Failed to load ${name}:`, err);
        setError(err.message);
      });
  }, [name, scriptUrl]);

  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c33' }}>
        <h3>Error loading {name}</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!loaded) {
    return <div>Loading {name}...</div>;
  }

  return (
    <div ref={containerRef} style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>{name}</h3>
      {/* Micro frontend will mount here */}
    </div>
  );
}

// =====================================================
// 7. FEATURE FLAGS & ROUTING
// =====================================================

/**
 * Feature flag manager for micro frontends
 */
class FeatureFlagManager {
  constructor(flags = {}) {
    this.flags = flags;
  }

  isEnabled(featureName) {
    return this.flags[featureName] === true;
  }

  enable(featureName) {
    this.flags[featureName] = true;
  }

  disable(featureName) {
    this.flags[featureName] = false;
  }

  getFlags() {
    return { ...this.flags };
  }
}

export const featureFlags = new FeatureFlagManager({
  newDashboard: true,
  betaFeatures: false,
  darkMode: true,
  analyticsModule: true
});

/**
 * Hook to use feature flags
 */
function useFeatureFlag(featureName) {
  const [isEnabled, setIsEnabled] = React.useState(
    featureFlags.isEnabled(featureName)
  );

  return isEnabled;
}

/**
 * Conditional micro frontend rendering based on flags
 */
function FeatureFlaggedApp() {
  const showBetaFeatures = useFeatureFlag('betaFeatures');
  const showAnalytics = useFeatureFlag('analyticsModule');

  return (
    <div>
      <h2>Feature-Flagged Micro Frontends</h2>
      
      {showBetaFeatures && (
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', marginBottom: '20px' }}>
          <h3>Beta Features (Enabled)</h3>
          <p>New experimental features are available</p>
        </div>
      )}

      {showAnalytics && (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
          <h3>Analytics Module</h3>
          <p>Analytics data and insights</p>
        </div>
      )}

      <button onClick={() => featureFlags.enable('betaFeatures')}>
        Enable Beta Features
      </button>
    </div>
  );
}

// =====================================================
// 8. BEST PRACTICES & ANTI-PATTERNS
// =====================================================

/**
 * BEST PRACTICES:
 * 
 * 1. Clear Boundaries
 *    - Define clear interfaces between micro frontends
 *    - Document what each module exposes
 * 
 * 2. Shared Dependencies
 *    - Use package managers to manage versions
 *    - Avoid version conflicts of core libraries
 * 
 * 3. Error Handling
 *    - Handle failures gracefully
 *    - Don't let one micro frontend crash the entire app
 * 
 * 4. Performance
 *    - Code split at micro frontend boundaries
 *    - Lazy load micro frontends
 *    - Monitor bundle sizes
 * 
 * 5. Security
 *    - Validate origin in postMessage
 *    - Use Content Security Policy
 *    - Sanitize data between micro frontends
 * 
 * 6. Testing
 *    - Test micro frontends independently
 *    - Test integration between micro frontends
 *    - Use contract testing
 * 
 * 7. Communication
 *    - Use event bus or props for communication
 *    - Avoid tight coupling
 *    - Document event contracts
 * 
 * 8. Deployment
 *    - Independent deployments
 *    - Versioning strategy
 *    - Blue-green or canary deployments
 * 
 * 9. Monitoring
 *    - Monitor each micro frontend separately
 *    - Track cross-micro frontend errors
 *    - Performance monitoring
 * 
 * 10. Development
 *     - Local development setup
 *     - Mock other micro frontends in development
 *     - Hot reloading for faster development
 */

/**
 * ANTI-PATTERNS:
 * 
 * 1. Shared Mutable State
 *    - Avoid direct state sharing between micro frontends
 *    - Use immutable updates
 * 
 * 2. Tight Coupling
 *    - Avoid importing from other micro frontends directly
 *    - Use well-defined interfaces
 * 
 * 3. Global Scope Pollution
 *    - Don't pollute window object
 *    - Use namespacing for globals
 * 
 * 4. Blocking Operations
 *    - Avoid synchronous communication
 *    - Use async patterns
 * 
 * 5. Version Mismatches
 *    - Keep dependency versions aligned
 *    - Use semver properly
 * 
 * 6. Missing Error Boundaries
 *    - Always have error handling
 *    - Implement error boundaries
 * 
 * 7. Uncontrolled Side Effects
 *    - Clean up subscriptions
 *    - Manage timers and intervals
 * 
 * 8. Poor Documentation
 *    - Document interfaces clearly
 *    - Provide examples
 *    - Keep documentation updated
 */

/**
 * Complete Micro Frontend Example
 */
function MicroFrontendArchitectureDemo() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>React Micro Frontend Architecture Demo</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>1. Event-Based Communication</h2>
        <EventBasedMicroFrontendApp />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. Shared State Management</h2>
        <SharedStoreComponent />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>3. Feature Flags</h2>
        <FeatureFlaggedApp />
      </section>
    </div>
  );
}

// =====================================================
// EXPORTS
// =====================================================

export {
  ShellApp,
  IframeMicroFrontendApp,
  EventBasedMicroFrontendApp,
  AuthMicroFrontend,
  DashboardMicroFrontend,
  NotificationsMicroFrontend,
  SharedStoreComponent,
  WebComponentIntegration,
  DynamicMicroFrontendContainer,
  FeatureFlaggedApp,
  MicroFrontendArchitectureDemo,
  EventBus,
  MicroFrontendStore,
  FeatureFlagManager,
  useEventBus,
  useSharedStore,
  useFeatureFlag,
  loadMicroFrontend,
  WebComponentWrapper
};
