// Tvi3W Application - Main JavaScript

const app = {
  // Application State
  state: {
    currentPage: 'dashboard',
    meetingActive: false,
    meetingStartTime: null,
    meetingDuration: 0,
    questionsGenerated: 0,
    notesCount: 0,
    analysisData: null
  },

  // Initialize Application
  init() {
    console.log('🧠 Tvi3W Initialized');
    this.setupNavigation();
    this.loadRecentActivity();
    this.setupEventListeners();
  },

  // Navigation System
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });

    // Show/hide pages
    document.querySelectorAll('.page').forEach(pageEl => {
      pageEl.classList.add('hidden');
    });
    
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      targetPage.classList.add('fade-in');
      this.state.currentPage = page;
    }
  },

  // Platform Integration
  connectPlatform(platform) {
    const platformNames = {
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      gmail: 'Gmail'
    };

    this.showNotification(`Connecting to ${platformNames[platform]}...`, 'info');
    
    // Simulate connection
    setTimeout(() => {
      this.showNotification(`✓ Connected to ${platformNames[platform]}`, 'success');
      this.navigateTo('analysis');
      this.simulatePlatformContent(platform);
    }, 1500);
  },

  simulatePlatformContent(platform) {
    const contentArea = document.getElementById('content-area');
    const sampleContent = {
      linkedin: {
        title: 'LinkedIn Post Analysis',
        content: `<div style="padding: 1rem;">
          <h4 style="color: var(--primary-500); margin-bottom: 1rem;">Professional Post</h4>
          <p style="margin-bottom: 1rem;">"Excited to announce our new AI-powered analytics platform! 🚀 We've been working on this for months, and it's finally ready to transform how businesses make data-driven decisions."</p>
          <div style="display: flex; gap: 1rem; color: var(--text-tertiary); font-size: var(--font-size-sm);">
            <span>👍 245 likes</span>
            <span>💬 38 comments</span>
            <span>🔄 67 shares</span>
          </div>
        </div>`
      },
      twitter: {
        title: 'Twitter Thread Analysis',
        content: `<div style="padding: 1rem;">
          <h4 style="color: var(--secondary-500); margin-bottom: 1rem;">Trending Thread</h4>
          <p style="margin-bottom: 0.5rem;">"🧵 Thread on the future of AI assistants:</p>
          <p style="margin-bottom: 0.5rem;">1/ AI is moving beyond simple chatbots to become true personal assistants</p>
          <p style="margin-bottom: 1rem;">2/ The key is real-time analysis and contextual understanding..."</p>
          <div style="display: flex; gap: 1rem; color: var(--text-tertiary); font-size: var(--font-size-sm);">
            <span>❤️ 1.2K likes</span>
            <span>💬 156 replies</span>
            <span>🔄 423 retweets</span>
          </div>
        </div>`
      },
      gmail: {
        title: 'Email Analysis',
        content: `<div style="padding: 1rem;">
          <h4 style="color: var(--accent-500); margin-bottom: 1rem;">Important Email</h4>
          <p style="margin-bottom: 0.5rem;"><strong>From:</strong> investor@venturecapital.com</p>
          <p style="margin-bottom: 1rem;"><strong>Subject:</strong> Re: Investment Opportunity Discussion</p>
          <p>"Thank you for the detailed pitch deck. We're impressed with your traction and would like to schedule a follow-up meeting to discuss terms..."</p>
        </div>`
      }
    };

    const content = sampleContent[platform];
    contentArea.innerHTML = content.content;
    
    // Auto-analyze after a moment
    setTimeout(() => this.analyzeContent(), 1000);
  },

  // Content Analysis
  analyzeContent() {
    this.showNotification('🔍 Analyzing content...', 'info');
    
    const sentimentBar = document.getElementById('sentiment-bar');
    const sentimentText = document.getElementById('sentiment-text');
    const insightsContainer = document.getElementById('insights-container');

    // Simulate analysis
    setTimeout(() => {
      // Update sentiment
      const sentiment = 75;
      sentimentBar.style.width = `${sentiment}%`;
      sentimentText.textContent = `Positive sentiment detected (${sentiment}% confidence)`;
      sentimentText.style.color = 'var(--success-500)';

      // Generate insights
      const insights = [
        {
          icon: '🎯',
          title: 'Key Opportunity',
          text: 'High engagement rate suggests strong audience interest. Consider follow-up content.'
        },
        {
          icon: '💡',
          title: 'Suggested Action',
          text: 'Respond to top comments within 2 hours to maximize visibility and engagement.'
        },
        {
          icon: '📊',
          title: 'Trend Analysis',
          text: 'Topic aligns with current industry trends. Potential for viral reach.'
        },
        {
          icon: '🔗',
          title: 'Network Effect',
          text: 'Several influential accounts in your network have engaged. Consider direct outreach.'
        }
      ];

      insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-item">
          <div style="display: flex; align-items: start; gap: 0.75rem;">
            <span style="font-size: var(--font-size-xl);">${insight.icon}</span>
            <div>
              <h5 style="margin-bottom: 0.25rem; font-size: var(--font-size-base);">${insight.title}</h5>
              <p style="margin: 0; font-size: var(--font-size-sm); color: var(--text-tertiary);">${insight.text}</p>
            </div>
          </div>
        </div>
      `).join('');

      this.showNotification('✓ Analysis complete!', 'success');
    }, 2000);
  },

  // Meeting Companion
  toggleMeeting() {
    this.state.meetingActive = !this.state.meetingActive;
    const toggleBtn = document.getElementById('meeting-toggle');

    if (this.state.meetingActive) {
      toggleBtn.innerHTML = '<span>⏸️</span> Pause Meeting';
      toggleBtn.classList.remove('btn-primary');
      toggleBtn.classList.add('btn-secondary');
      this.startMeeting();
    } else {
      toggleBtn.innerHTML = '<span>▶️</span> Start Meeting';
      toggleBtn.classList.remove('btn-secondary');
      toggleBtn.classList.add('btn-primary');
      this.pauseMeeting();
    }
  },

  startMeeting() {
    this.state.meetingStartTime = Date.now();
    this.showNotification('🎙️ Meeting started - AI companion active', 'success');
    
    // Start duration counter
    this.meetingTimer = setInterval(() => {
      this.updateMeetingDuration();
    }, 1000);

    // Simulate meeting activity
    this.simulateMeetingTranscript();
    this.generateDynamicQuestions();
    this.simulatePassiveResearch();
  },

  pauseMeeting() {
    clearInterval(this.meetingTimer);
    this.showNotification('Meeting paused', 'info');
  },

  updateMeetingDuration() {
    const elapsed = Date.now() - this.state.meetingStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('meeting-duration').textContent = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  simulateMeetingTranscript() {
    const transcript = document.getElementById('transcript');
    const messages = [
      { speaker: 'You', text: 'Thanks everyone for joining. Let\'s discuss our Q4 strategy.' },
      { speaker: 'Sarah', text: 'I\'ve prepared some market analysis data. The trends are looking positive.' },
      { speaker: 'Michael', text: 'What about the competitive landscape? I noticed some new players.' },
      { speaker: 'You', text: 'Good point. Let\'s dive into that...' }
    ];

    transcript.innerHTML = '';
    messages.forEach((msg, index) => {
      setTimeout(() => {
        const msgEl = document.createElement('div');
        msgEl.className = 'transcript-message fade-in';
        msgEl.innerHTML = `
          <div class="speaker">${msg.speaker}</div>
          <p style="margin: 0;">${msg.text}</p>
        `;
        transcript.appendChild(msgEl);
        transcript.scrollTop = transcript.scrollHeight;

        // Generate notes for important points
        if (index % 2 === 0) {
          this.addSmartNote(msg.text);
        }
      }, index * 3000);
    });
  },

  generateDynamicQuestions() {
    const questionsContainer = document.getElementById('question-bubbles');
    const questionTypes = [
      { type: 'professional', questions: [
        'What metrics are we using to measure success?',
        'How does this align with our annual goals?',
        'What resources do we need to allocate?'
      ]},
      { type: 'social', questions: [
        'How is everyone feeling about the timeline?',
        'What challenges are teams facing?',
        'Any concerns we should address?'
      ]},
      { type: 'humorous', questions: [
        'Should we celebrate with pizza when we hit our targets? 🍕',
        'Who\'s bringing the coffee for late-night sessions? ☕',
        'Is this the part where we pretend to understand the spreadsheet? 📊'
      ]}
    ];

    questionsContainer.innerHTML = '<h5 style="margin-bottom: 1rem; font-size: var(--font-size-sm); color: var(--text-tertiary);">Suggested Questions:</h5>';

    questionTypes.forEach((category, catIndex) => {
      category.questions.forEach((question, qIndex) => {
        setTimeout(() => {
          const bubble = document.createElement('div');
          bubble.className = `question-bubble ${category.type}`;
          bubble.textContent = question;
          bubble.onclick = () => this.useQuestion(question);
          questionsContainer.appendChild(bubble);
          
          this.state.questionsGenerated++;
          document.getElementById('questions-count').textContent = this.state.questionsGenerated;
        }, (catIndex * 3 + qIndex) * 2000);
      });
    });
  },

  useQuestion(question) {
    this.showNotification(`Question added to notes: "${question}"`, 'success');
    this.addSmartNote(`💡 Question: ${question}`);
  },

  addSmartNote(note) {
    const notesContainer = document.getElementById('smart-notes');
    if (notesContainer.querySelector('p')) {
      notesContainer.innerHTML = '';
    }

    const noteEl = document.createElement('div');
    noteEl.className = 'transcript-message fade-in';
    noteEl.innerHTML = `<p style="margin: 0; font-size: var(--font-size-sm);">${note}</p>`;
    notesContainer.appendChild(noteEl);

    this.state.notesCount++;
    document.getElementById('notes-count').textContent = this.state.notesCount;
  },

  simulatePassiveResearch() {
    const researchPanel = document.getElementById('research-panel');
    const researchItems = [
      { title: 'Market Trends', info: 'AI assistant market projected to grow 35% YoY' },
      { title: 'Competitor Analysis', info: 'Top 3 competitors: AssistAI, SmartHelper, AICompanion' },
      { title: 'Industry Insights', info: 'Real-time analysis features are becoming standard' }
    ];

    researchPanel.innerHTML = '';
    researchItems.forEach((item, index) => {
      setTimeout(() => {
        const itemEl = document.createElement('div');
        itemEl.className = 'fade-in';
        itemEl.style.marginBottom = '1rem';
        itemEl.innerHTML = `
          <h5 style="font-size: var(--font-size-sm); color: var(--primary-500); margin-bottom: 0.25rem;">${item.title}</h5>
          <p style="margin: 0; font-size: var(--font-size-xs); color: var(--text-tertiary);">${item.info}</p>
        `;
        researchPanel.appendChild(itemEl);
      }, index * 2500);
    });
  },

  // Business Tools
  addContract() {
    this.showNotification('📋 Opening contract form...', 'info');
    // In a real app, this would open a modal or form
  },

  scheduleVenue() {
    this.showNotification('📅 Opening venue scheduler...', 'info');
    // In a real app, this would open a calendar interface
  },

  addContact() {
    this.showNotification('👥 Opening contact form...', 'info');
    // In a real app, this would open a contact management interface
  },

  analyzePitch() {
    this.showNotification('🦈 Starting Shark Tank analysis...', 'info');
    setTimeout(() => {
      this.showNotification('✓ Pitch analysis complete! Check the results.', 'success');
    }, 2000);
  },

  // Utility Functions
  saveInsight() {
    this.showNotification('💾 Insight saved to your dashboard', 'success');
  },

  shareInsight() {
    this.showNotification('📤 Share options opened', 'info');
  },

  startAnalysis() {
    this.navigateTo('analysis');
    this.showNotification('🚀 Analysis mode activated', 'success');
  },

  loadRecentActivity() {
    // Recent activity is already in the HTML
    console.log('Recent activity loaded');
  },

  setupEventListeners() {
    // Add any additional event listeners here
    document.addEventListener('keydown', (e) => {
      // Keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.navigateTo('dashboard');
            break;
          case '2':
            e.preventDefault();
            this.navigateTo('analysis');
            break;
          case '3':
            e.preventDefault();
            this.navigateTo('meetings');
            break;
          case '4':
            e.preventDefault();
            this.navigateTo('business');
            break;
        }
      }
    });
  },

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: var(--surface-glass);
      backdrop-filter: blur(var(--blur-md));
      border-radius: var(--border-radius-lg);
      border-left: 4px solid ${type === 'success' ? 'var(--success-500)' : type === 'error' ? 'var(--danger-500)' : 'var(--primary-500)'};
      box-shadow: var(--shadow-xl);
      z-index: 10000;
      max-width: 350px;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(400px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Expose app to window for inline onclick handlers
window.app = app;
