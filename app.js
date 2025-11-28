// Tvi3W Application - Main JavaScript

const app = {
  // Application State
  state: {
    currentPage: 'dashboard',
    currentPlatform: null,
    meetingActive: false,
    meetingStartTime: null,
    meetingDuration: 0,
    meetingTranscript: '',
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
    this.initSocket();
  },

  // Socket.IO Connection
  initSocket() {
    try {
      // Connect to backend socket server
      this.socket = io('http://localhost:3000');

      this.socket.on('connect', () => {
        console.log('🔌 WebSocket connected');
        this.showNotification('🟢 Real-time connection active', 'success');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
        this.showNotification('🔴 Real-time connection lost', 'error');
      });

      // Listen for real-time updates
      this.socket.on('analysis_update', (data) => {
        this.handleAnalysisUpdate(data);
      });

    } catch (error) {
      console.error('Socket initialization failed:', error);
    }
  },

  handleAnalysisUpdate(data) {
    this.showNotification(`🔔 New update: ${data.message}`, 'info');
    // Update UI based on data...
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
    this.state.currentPlatform = platform; // Store for API calls

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
  async analyzeContent() {
    this.showNotification('🔍 Analyzing content with AI...', 'info');

    const sentimentBar = document.getElementById('sentiment-bar');
    const sentimentText = document.getElementById('sentiment-text');
    const insightsContainer = document.getElementById('insights-container');
    const contentArea = document.getElementById('content-area');

    // Get content from the display area
    const content = contentArea.textContent || contentArea.innerText;

    try {
      // Call real API
      const response = await api.analyzeContent(content, this.state.currentPlatform || 'general');
      const analysis = response.data;

      // Update sentiment
      const sentiment = analysis.sentiment.confidence || 75;
      sentimentBar.style.width = `${sentiment}%`;

      const sentimentColor = analysis.sentiment.type === 'positive' ? 'var(--success-500)' :
        analysis.sentiment.type === 'negative' ? 'var(--danger-500)' :
          'var(--warning-500)';

      sentimentText.textContent = `${analysis.sentiment.type.charAt(0).toUpperCase() + analysis.sentiment.type.slice(1)} sentiment detected (${sentiment}% confidence)`;
      sentimentText.style.color = sentimentColor;

      // Generate insights
      const insights = analysis.insights || [];

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

      this.state.analysisData = analysis;
      this.showNotification('✓ AI analysis complete!', 'success');
    } catch (error) {
      console.error('Analysis failed:', error);
      this.showNotification('⚠️ Analysis failed. Using fallback mode.', 'error');

      // Fallback to simulated analysis if API fails
      this.analyzeContentFallback();
    }
  },

  analyzeContentFallback() {
    const sentimentBar = document.getElementById('sentiment-bar');
    const sentimentText = document.getElementById('sentiment-text');
    const insightsContainer = document.getElementById('insights-container');

    // Fallback analysis
    const sentiment = 75;
    sentimentBar.style.width = `${sentiment}%`;
    sentimentText.textContent = `Positive sentiment detected (${sentiment}% confidence)`;
    sentimentText.style.color = 'var(--success-500)';

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
    this.state.meetingTranscript = '';

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

        // Add to transcript for AI processing
        this.state.meetingTranscript += `${msg.speaker}: ${msg.text}\n`;

        // Generate notes for important points
        if (index % 2 === 0) {
          this.addSmartNote(msg.text);
        }
      }, index * 3000);
    });
  },

  async generateDynamicQuestions() {
    const questionsContainer = document.getElementById('question-bubbles');
    questionsContainer.innerHTML = '<h5 style="margin-bottom: 1rem; font-size: var(--font-size-sm); color: var(--text-tertiary);">Generating AI questions...</h5>';

    try {
      // Use transcript as context for AI question generation
      const context = this.state.meetingTranscript || 'Q4 strategy meeting discussion';
      const response = await api.generateQuestions(context, 'all');
      const questions = response.data;

      questionsContainer.innerHTML = '<h5 style="margin-bottom: 1rem; font-size: var(--font-size-sm); color: var(--text-tertiary);">AI-Generated Questions:</h5>';

      const questionTypes = [
        { type: 'professional', questions: questions.professional || [] },
        { type: 'social', questions: questions.social || [] },
        { type: 'humorous', questions: questions.humorous || [] }
      ];

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
          }, (catIndex * 3 + qIndex) * 1500);
        });
      });
    } catch (error) {
      console.error('Failed to generate questions:', error);
      this.generateDynamicQuestionsFallback(questionsContainer);
    }
  },

  generateDynamicQuestionsFallback(container) {
    const questionTypes = [
      {
        type: 'professional', questions: [
          'What metrics are we using to measure success?',
          'How does this align with our annual goals?',
          'What resources do we need to allocate?'
        ]
      },
      {
        type: 'social', questions: [
          'How is everyone feeling about the timeline?',
          'What challenges are teams facing?',
          'Any concerns we should address?'
        ]
      },
      {
        type: 'humorous', questions: [
          'Should we celebrate with pizza when we hit our targets? 🍕',
          'Who\'s bringing the coffee for late-night sessions? ☕',
          'Is this the part where we pretend to understand the spreadsheet? 📊'
        ]
      }
    ];

    container.innerHTML = '<h5 style="margin-bottom: 1rem; font-size: var(--font-size-sm); color: var(--text-tertiary);">Suggested Questions:</h5>';

    questionTypes.forEach((category, catIndex) => {
      category.questions.forEach((question, qIndex) => {
        setTimeout(() => {
          const bubble = document.createElement('div');
          bubble.className = `question-bubble ${category.type}`;
          bubble.textContent = question;
          bubble.onclick = () => this.useQuestion(question);
          container.appendChild(bubble);

          this.state.questionsGenerated++;
          document.getElementById('questions-count').textContent = this.state.questionsGenerated;
        }, (catIndex * 3 + qIndex) * 1500);
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

  async simulatePassiveResearch() {
    const researchPanel = document.getElementById('research-panel');
    const topics = ['AI assistant market trends', 'Competitor analysis in AI space', 'Real-time analysis technology'];

    researchPanel.innerHTML = '';

    for (let i = 0; i < topics.length; i++) {
      setTimeout(async () => {
        try {
          const response = await api.researchTopic(topics[i]);
          const research = response.data;

          const itemEl = document.createElement('div');
          itemEl.className = 'fade-in';
          itemEl.style.marginBottom = '1rem';
          itemEl.innerHTML = `
            <h5 style="font-size: var(--font-size-sm); color: var(--primary-500); margin-bottom: 0.25rem;">${research.title}</h5>
            <p style="margin: 0; font-size: var(--font-size-xs); color: var(--text-tertiary);">${research.info}</p>
          `;
          researchPanel.appendChild(itemEl);
        } catch (error) {
          console.error('Research failed:', error);
          // Fallback
          const fallbackItems = [
            { title: 'Market Trends', info: 'AI assistant market projected to grow 35% YoY' },
            { title: 'Competitor Analysis', info: 'Top 3 competitors: AssistAI, SmartHelper, AICompanion' },
            { title: 'Industry Insights', info: 'Real-time analysis features are becoming standard' }
          ];
          const item = fallbackItems[i];
          const itemEl = document.createElement('div');
          itemEl.className = 'fade-in';
          itemEl.style.marginBottom = '1rem';
          itemEl.innerHTML = `
            <h5 style="font-size: var(--font-size-sm); color: var(--primary-500); margin-bottom: 0.25rem;">${item.title}</h5>
            <p style="margin: 0; font-size: var(--font-size-xs); color: var(--text-tertiary);">${item.info}</p>
          `;
          researchPanel.appendChild(itemEl);
        }
      }, i * 2500);
    }
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

  async analyzePitch() {
    this.showNotification('🦈 Starting AI Shark Tank analysis...', 'info');

    try {
      const pitch = 'AI-powered personal assistant for analyzing live interactions and meetings with real-time insights';
      const response = await api.analyzePitch(pitch);
      const analysis = response.data;

      // Update the UI with analysis results
      const analysisContainer = document.querySelector('#business-page .glass-card:last-child > div');
      if (analysisContainer) {
        analysisContainer.innerHTML = `
          <h4 style="font-size: var(--font-size-base); margin-bottom: 0.5rem;">Latest AI Analysis</h4>
          <p style="font-size: var(--font-size-sm); color: var(--text-tertiary);">
            <strong>Strengths:</strong> ${analysis.strengths.join(', ')}<br>
            <strong>Concerns:</strong> ${analysis.concerns.join(', ')}<br>
            <strong>Recommendation:</strong> ${analysis.recommendations.join(', ')}<br>
            <strong>Investment Potential:</strong> ${analysis.investmentPotential.toUpperCase()}<br>
            <strong>Summary:</strong> ${analysis.summary}
          </p>
        `;
      }

      this.showNotification('✓ AI pitch analysis complete!', 'success');
    } catch (error) {
      console.error('Pitch analysis failed:', error);
      this.showNotification('⚠️ Analysis failed. Using fallback mode.', 'error');
    }
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
        switch (e.key) {
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
