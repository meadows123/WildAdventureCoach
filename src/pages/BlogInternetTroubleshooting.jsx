import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wifi, Monitor, Terminal, AlertTriangle, CheckCircle, HelpCircle, Activity, Gauge, Download } from 'lucide-react';

const BlogInternetTroubleshooting = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const fadeLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  return (
    <>
      <Helmet>
        <title>How to Fix Home Internet Slow Speeds — Troubleshooting Guide | Wild Adventure Coach</title>
        <meta
          name="description"
          content="Internet slow speeds at home? Follow this step-by-step troubleshooting guide to diagnose and fix slow internet — including how to run a ping test, use iPerf3 for accurate speed testing, and deal with packet loss and drops."
        />
        <meta
          name="keywords"
          content="internet slow speeds, how to fix home internet slow speed, home internet troubleshooting, why is my internet slow, fix slow wifi, ping test internet, iperf3 speed test, packet loss fix, internet dropping, slow broadband fix, home network troubleshooting, how to test internet speed accurately, internet keeps dropping, slow internet connection fix"
        />
        <meta property="og:title" content="How to Fix Home Internet Slow Speeds — Step-by-Step Guide" />
        <meta
          property="og:description"
          content="Internet slow speeds at home? This guide walks you through diagnosing the problem — from the right questions to ask, to running a continuous ping test and using iPerf3 for a proper speed test."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wildadventurecoach.co.uk/blog/internet-troubleshooting" />
      </Helmet>

      <div className="min-h-screen pt-20 pb-24 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-16 sm:pt-20 md:pt-24 pb-12 text-center"
          >
            <span className="inline-block text-sm font-semibold tracking-widest uppercase text-[#C65D2B] mb-4">
              Tech Guide
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F7F5EB] mb-6 leading-tight">
              How to Fix Home Internet Slow Speeds —<br className="hidden sm:block" /> A Step-by-Step Guide
            </h1>
            <p className="text-base sm:text-lg text-[#DCCCA3] max-w-2xl mx-auto">
              Experiencing slow internet speeds at home? Before you call your ISP or restart the router for
              the tenth time, take five minutes to actually diagnose what's going on. This guide walks you
              through it — clearly, step by step.
            </p>
            <div className="mt-8 w-16 h-1 bg-[#C65D2B] mx-auto rounded-full" />
          </motion.section>

          {/* ── SECTION 1: Ask yourself ── */}
          <motion.section {...fadeUp} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#C65D2B]/20">
                <HelpCircle className="text-[#C65D2B]" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">
                Step 1 — Ask Yourself the Right Questions
              </h2>
            </div>
            <p className="text-[#DCCCA3] mb-6 text-base sm:text-lg">
              Before you touch anything, slow down and think about exactly what is and isn't working. The more
              precise your answers, the faster you'll fix it.
            </p>

            <div className="space-y-5">
              {[
                {
                  q: 'What exactly is happening?',
                  a: "Are pages failing to load, loading slowly, or timing out mid-use? Is a video call dropping or just choppy? Is a download stalling? Being specific here matters — \"the internet is broken\" tells you nothing, but \"YouTube buffers after 10 seconds\" tells you a lot.",
                },
                {
                  q: 'What are you trying to connect to?',
                  a: 'Is the problem with one specific website or service, or everything? If only one site is down, the issue is likely on their end — not yours. Try opening google.com and bbc.com. If those load fine, the problem is probably with the individual service.',
                },
                {
                  q: 'When did it start?',
                  a: 'Did this start after a router restart? After a Windows update? After plugging in a new device? Timing gives you a strong clue. If it just started randomly with no changes, your ISP or your hardware is the more likely culprit.',
                },
                {
                  q: 'Is it happening on multiple devices?',
                  a: 'This is one of the most important questions. Check your phone, a laptop, and any other device on the same network. If only one device has the problem, the issue is with that device — not your router or ISP. If all devices are affected, the problem is upstream: your router, modem, or ISP.',
                },
                {
                  q: 'Are you on Wi-Fi or plugged in?',
                  a: 'Wi-Fi and wired connections can behave very differently. If you\'re on Wi-Fi, move closer to the router and test again. If possible, plug directly into the router with an Ethernet cable — if things improve immediately, your Wi-Fi signal is likely the issue, not your internet connection itself.',
                },
              ].map(({ q, a }, i) => (
                <motion.div
                  key={i}
                  {...fadeLeft}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-[#2E4A34]/40 border border-[#2E4A34] rounded-xl p-5"
                >
                  <p className="text-[#F7F5EB] font-semibold mb-2 flex items-start gap-2">
                    <span className="text-[#C65D2B] font-bold shrink-0">Q:</span> {q}
                  </p>
                  <p className="text-[#DCCCA3] text-sm sm:text-base leading-relaxed">{a}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── SECTION 2: Continuous Ping ── */}
          <motion.section {...fadeUp} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#C65D2B]/20">
                <Activity className="text-[#C65D2B]" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">
                Step 2 — Run a Continuous Ping Test
              </h2>
            </div>
            <p className="text-[#DCCCA3] mb-4 text-base sm:text-lg">
              A <strong className="text-[#F7F5EB]">ping test</strong> sends small packets of data to a server and
              measures how long they take to come back. By pinging Google's public DNS server{' '}
              <span className="text-[#C65D2B] font-mono font-semibold">8.8.8.8</span> continuously, you get a
              live feed of your connection's health — making it easy to spot drops, spikes, or instability as
              they happen.
            </p>
            <p className="text-[#DCCCA3] mb-8 text-base sm:text-lg">
              Here's how to do it on each operating system:
            </p>

            {/* Windows */}
            <motion.div {...fadeUp} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Monitor size={20} className="text-[#DCCCA3]" />
                <h3 className="text-xl font-bold text-[#F7F5EB]">Windows</h3>
              </div>
              <ol className="list-none space-y-3 text-[#DCCCA3] text-sm sm:text-base mb-4">
                <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">1.</span> Press <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Windows</kbd> + <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">R</kbd> on your keyboard to open the Run dialog.</li>
                <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">2.</span> Type <span className="text-[#F7F5EB] font-mono">cmd</span> and press <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Enter</kbd> to open Command Prompt.</li>
                <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">3.</span> In the black window that opens, type the command below exactly and press <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Enter</kbd>.</li>
              </ol>
              <div className="bg-[#1a2e1e] border border-[#2E4A34] rounded-xl p-4 font-mono flex items-center gap-3">
                <Terminal size={18} className="text-[#C65D2B] shrink-0" />
                <span className="text-[#6ee37e] text-sm sm:text-base select-all">ping 8.8.8.8 -t</span>
              </div>
              <p className="text-[#DCCCA3] text-sm mt-3">
                The <span className="text-[#F7F5EB] font-mono">-t</span> flag tells Windows to keep pinging forever until you stop it. To stop, press{' '}
                <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Ctrl</kbd> +{' '}
                <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">C</kbd>.
              </p>
            </motion.div>

            {/* Mac */}
            <motion.div {...fadeUp} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Monitor size={20} className="text-[#DCCCA3]" />
                <h3 className="text-xl font-bold text-[#F7F5EB]">Mac</h3>
              </div>
              <ol className="list-none space-y-3 text-[#DCCCA3] text-sm sm:text-base mb-4">
                <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">1.</span> Press <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">⌘ Cmd</kbd> + <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Space</kbd> to open Spotlight, then type <span className="text-[#F7F5EB] font-mono">Terminal</span> and press <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Enter</kbd>.</li>
                <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">2.</span> Type the command below and press <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Enter</kbd>.</li>
              </ol>
              <div className="bg-[#1a2e1e] border border-[#2E4A34] rounded-xl p-4 font-mono flex items-center gap-3">
                <Terminal size={18} className="text-[#C65D2B] shrink-0" />
                <span className="text-[#6ee37e] text-sm sm:text-base select-all">ping 8.8.8.8</span>
              </div>
              <p className="text-[#DCCCA3] text-sm mt-3">
                On Mac, ping runs continuously by default. Press{' '}
                <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Ctrl</kbd> +{' '}
                <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">C</kbd> to stop it when you're done.
              </p>
            </motion.div>

            {/* Reading results */}
            <motion.div {...fadeUp} className="bg-[#2E4A34]/40 border border-[#2E4A34] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#F7F5EB] mb-4">What a Healthy Ping Looks Like</h3>
              <div className="bg-[#1a2e1e] rounded-lg p-4 font-mono text-xs sm:text-sm text-[#6ee37e] space-y-1 mb-5 overflow-x-auto">
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">12ms</span> TTL=118</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">11ms</span> TTL=118</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">13ms</span> TTL=118</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">12ms</span> TTL=118</p>
              </div>
              <ul className="space-y-2 text-[#DCCCA3] text-sm sm:text-base">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-1 shrink-0" /> <span><strong className="text-[#F7F5EB]">Low, stable ms values (under 50ms)</strong> — your connection is healthy.</span></li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-1 shrink-0" /> <span><strong className="text-[#F7F5EB]">Consistent numbers</strong> — very little variation means a stable line.</span></li>
              </ul>
            </motion.div>
          </motion.section>

          {/* ── SECTION 3: Speed Testing ── */}
          <motion.section {...fadeUp} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#C65D2B]/20">
                <Gauge className="text-[#C65D2B]" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">
                Step 3 — Testing Your Actual Speed
              </h2>
            </div>

            <p className="text-[#DCCCA3] mb-6 text-base sm:text-lg">
              Once you've looked at your connection's stability with a ping test, the next question is often:
              <em className="text-[#F7F5EB]"> "Am I actually getting the speeds I'm paying for?"</em>
            </p>

            {/* Why browser speed tests aren't reliable */}
            <motion.div {...fadeUp} className="bg-[#2E4A34]/40 border border-[#2E4A34] rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-[#F7F5EB] mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-400" />
                Why Browser Speed Tests Aren't Fully Reliable
              </h3>
              <p className="text-[#DCCCA3] text-sm sm:text-base mb-3">
                Sites like Speedtest.net or Fast.com are convenient, but they come with real limitations. A browser-based test is:
              </p>
              <ul className="space-y-3 text-[#DCCCA3] text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold shrink-0">—</span>
                  <span><strong className="text-[#F7F5EB]">Limited by your browser's overhead.</strong> Your browser adds its own processing layer between you and the network, which can cap or skew results — especially at very high speeds (500 Mbps+).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold shrink-0">—</span>
                  <span><strong className="text-[#F7F5EB]">Dependent on a single server.</strong> The test server's location, load, and peering arrangement with your ISP all affect your result. A "bad" server can make a good connection look slow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold shrink-0">—</span>
                  <span><strong className="text-[#F7F5EB]">ISP-aware.</strong> Some ISPs have been known to prioritise traffic to known speed test servers, which can make your results look better than your everyday real-world speeds actually are.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold shrink-0">—</span>
                  <span><strong className="text-[#F7F5EB]">Single-threaded by default.</strong> Many browser tests only open a few connections, which doesn't stress your line the same way real usage (streaming + browsing + a download all at once) does.</span>
                </li>
              </ul>
              <p className="text-[#DCCCA3] text-sm mt-4">
                Browser tests are fine for a quick rough check. But if you're diagnosing a real problem or trying to prove to your ISP that you're not getting your contracted speed — you need something more rigorous.
              </p>
            </motion.div>

            {/* iPerf */}
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-4">
                <Download size={20} className="text-[#C65D2B]" />
                <h3 className="text-xl font-bold text-[#F7F5EB]">
                  Use iPerf3 for a Proper Speed Test
                </h3>
              </div>
              <p className="text-[#DCCCA3] text-sm sm:text-base mb-6">
                <strong className="text-[#F7F5EB]">iPerf3</strong> is a free, open-source tool used by network engineers to measure real throughput between two points. Unlike a browser test, it runs natively on your system — bypassing the browser entirely — and lets you test your connection properly.
              </p>

              {/* Download steps */}
              <div className="space-y-6 mb-8">

                {/* Windows iPerf */}
                <div className="bg-[#1a2e1e] border border-[#2E4A34] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor size={18} className="text-[#DCCCA3]" />
                    <h4 className="font-bold text-[#F7F5EB]">Windows — Download & Install</h4>
                  </div>
                  <ol className="space-y-3 text-[#DCCCA3] text-sm sm:text-base">
                    <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">1.</span> Go to <span className="text-[#C65D2B] font-mono">https://iperf.fr/iperf-download.php</span> and download the Windows version (it's a small zip file, no installation needed).</li>
                    <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">2.</span> Extract the zip file to somewhere easy to find — for example, your Desktop or <span className="font-mono text-[#F7F5EB]">C:\iperf3</span>.</li>
                    <li className="flex gap-3"><span className="text-[#C65D2B] font-bold shrink-0">3.</span> Open Command Prompt (<kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">Windows</kbd> + <kbd className="bg-[#2E4A34] text-[#F7F5EB] px-2 py-0.5 rounded text-xs font-mono border border-[#3a5a40]">R</kbd>, type <span className="font-mono text-[#F7F5EB]">cmd</span>), then navigate to the folder you extracted to:</li>
                  </ol>
                  <div className="bg-[#0f1f12] rounded-lg p-3 font-mono text-xs sm:text-sm text-[#6ee37e] mt-3 overflow-x-auto">
                    <p className="text-[#DCCCA3]"># Navigate to the folder (adjust path if needed)</p>
                    <p>cd C:\iperf3</p>
                  </div>
                </div>

                {/* Mac iPerf */}
                <div className="bg-[#1a2e1e] border border-[#2E4A34] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor size={18} className="text-[#DCCCA3]" />
                    <h4 className="font-bold text-[#F7F5EB]">Mac — Install via Homebrew</h4>
                  </div>
                  <p className="text-[#DCCCA3] text-sm mb-3">
                    The easiest way on Mac is via Homebrew. If you don't have Homebrew, install it first at <span className="text-[#C65D2B] font-mono">https://brew.sh</span>. Then open Terminal and run:
                  </p>
                  <div className="bg-[#0f1f12] rounded-lg p-3 font-mono text-xs sm:text-sm text-[#6ee37e] overflow-x-auto">
                    <p>brew install iperf3</p>
                  </div>
                </div>
              </div>

              {/* Running the test */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#F7F5EB] mb-3">Running the Speed Test</h3>
                <p className="text-[#DCCCA3] text-sm sm:text-base mb-4">
                  iPerf3 needs two endpoints — a <strong className="text-[#F7F5EB]">server</strong> and a <strong className="text-[#F7F5EB]">client</strong>. For home testing, the easiest approach is to connect to a public iPerf3 server. There are several maintained lists online — search for <span className="text-[#C65D2B] font-mono">public iperf3 servers</span> to find one geographically close to you.
                </p>
                <p className="text-[#DCCCA3] text-sm sm:text-base mb-5">
                  Once you have a server address (for example <span className="font-mono text-[#F7F5EB]">iperf.he.net</span>), run:
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-[#DCCCA3] text-xs font-semibold uppercase tracking-wider mb-2">Download test (how fast data comes TO you)</p>
                    <div className="bg-[#1a2e1e] border border-[#2E4A34] rounded-xl p-4 font-mono flex items-center gap-3">
                      <Terminal size={18} className="text-[#C65D2B] shrink-0" />
                      <span className="text-[#6ee37e] text-sm sm:text-base select-all overflow-x-auto">iperf3 -c iperf.he.net -R</span>
                    </div>
                    <p className="text-[#DCCCA3] text-xs mt-2">The <span className="font-mono text-[#F7F5EB]">-R</span> flag reverses the direction so the server sends data to you (simulating a download).</p>
                  </div>
                  <div>
                    <p className="text-[#DCCCA3] text-xs font-semibold uppercase tracking-wider mb-2">Upload test (how fast data goes FROM you)</p>
                    <div className="bg-[#1a2e1e] border border-[#2E4A34] rounded-xl p-4 font-mono flex items-center gap-3">
                      <Terminal size={18} className="text-[#C65D2B] shrink-0" />
                      <span className="text-[#6ee37e] text-sm sm:text-base select-all overflow-x-auto">iperf3 -c iperf.he.net</span>
                    </div>
                    <p className="text-[#DCCCA3] text-xs mt-2">Without <span className="font-mono text-[#F7F5EB]">-R</span>, traffic flows outward from your machine — this measures your upload speed.</p>
                  </div>
                </div>
              </div>

              {/* Reading iPerf output */}
              <div className="bg-[#2E4A34]/40 border border-[#2E4A34] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#F7F5EB] mb-4">Reading the iPerf3 Results</h3>
                <div className="bg-[#1a2e1e] rounded-lg p-4 font-mono text-xs sm:text-sm space-y-1 mb-5 overflow-x-auto">
                  <p className="text-[#6ee37e]">[ ID] Interval       Transfer     Bitrate         Retr</p>
                  <p className="text-[#6ee37e]">[  5]  0.00-1.00 sec  55.2 MBytes  <span className="text-yellow-300">463 Mbits/sec</span>    2</p>
                  <p className="text-[#6ee37e]">[  5]  1.00-2.00 sec  56.8 MBytes  <span className="text-yellow-300">477 Mbits/sec</span>    0</p>
                  <p className="text-[#6ee37e]">[  5]  2.00-3.00 sec  54.9 MBytes  <span className="text-yellow-300">461 Mbits/sec</span>    1</p>
                  <p className="text-[#DCCCA3]">- - - - - - - - - - - - - - - - - -</p>
                  <p className="text-[#6ee37e]">[ ID] Interval       Transfer     Bitrate         Retr</p>
                  <p className="text-[#6ee37e]">[  5]  0.00-10.00 sec  549 MBytes  <span className="text-yellow-300">461 Mbits/sec</span>   12  sender</p>
                </div>
                <ul className="space-y-3 text-[#DCCCA3] text-sm sm:text-base">
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /><span><strong className="text-[#F7F5EB]">Bitrate</strong> — your actual throughput in Megabits per second (Mbits/sec). Compare this to the speed your ISP sells you.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /><span><strong className="text-[#F7F5EB]">Retr (Retransmits)</strong> — how many packets had to be re-sent. A few is normal; a large number indicates line instability.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /><span><strong className="text-[#F7F5EB]">Consistent per-second readings</strong> — big swings between intervals (e.g. 450 Mbits down to 50 Mbits) reveal an unstable or congested line.</span></li>
                </ul>
                <p className="text-[#DCCCA3] text-sm mt-4 border-t border-[#2E4A34] pt-4">
                  <strong className="text-[#F7F5EB]">Pro tip:</strong> Run iPerf3 both over Wi-Fi and via a wired Ethernet cable. If you see dramatically different results, your issue is within your own network — not the connection coming into your home.
                </p>
              </div>
            </motion.div>
          </motion.section>

          {/* ── SECTION 4: Drops ── */}
          <motion.section {...fadeUp} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#C65D2B]/20">
                <AlertTriangle className="text-[#C65D2B]" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">
                Step 4 — Understanding & Dealing with Drops
              </h2>
            </div>

            <p className="text-[#DCCCA3] mb-8 text-base sm:text-lg">
              Now that your ping is running, here's what to watch for and what it means:
            </p>

            {/* High latency */}
            <motion.div {...fadeUp} className="mb-8">
              <h3 className="text-xl font-bold text-[#F7F5EB] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> High Latency (Slow Response Times)
              </h3>
              <div className="bg-[#1a2e1e] rounded-lg p-4 font-mono text-xs sm:text-sm text-[#6ee37e] space-y-1 mb-4 overflow-x-auto">
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">342ms</span> TTL=118</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">489ms</span> TTL=118</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">711ms</span> TTL=118</p>
              </div>
              <p className="text-[#DCCCA3] text-sm sm:text-base mb-3">
                High latency (200ms+) means data is taking a long time to travel. This causes laggy video calls, slow page loads, and rubberbanding in games. It doesn't always mean your connection is dropping — it means it's congested or struggling.
              </p>
              <ul className="space-y-2 text-[#DCCCA3] text-sm sm:text-base">
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> Check if someone else on the network is streaming, uploading, or gaming heavily — this can saturate the connection.</li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> Move closer to the router, or plug in via Ethernet to rule out Wi-Fi signal issues.</li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> Restart your router by unplugging it from the wall, waiting 30 seconds, and plugging it back in.</li>
              </ul>
            </motion.div>

            {/* Packet loss */}
            <motion.div {...fadeUp} className="mb-8">
              <h3 className="text-xl font-bold text-[#F7F5EB] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Packet Loss (Request Timed Out)
              </h3>
              <div className="bg-[#1a2e1e] rounded-lg p-4 font-mono text-xs sm:text-sm text-[#6ee37e] space-y-1 mb-4 overflow-x-auto">
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">13ms</span> TTL=118</p>
                <p className="text-red-400">Request timed out.</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">14ms</span> TTL=118</p>
                <p className="text-red-400">Request timed out.</p>
                <p>Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">12ms</span> TTL=118</p>
              </div>
              <p className="text-[#DCCCA3] text-sm sm:text-base mb-3">
                "Request timed out" means a packet was sent but never came back. Occasional single timeouts can be ignored — every network sees one now and then. But if you're seeing them regularly (every few seconds, or in clusters), you have packet loss, which is a real problem.
              </p>
              <ul className="space-y-2 text-[#DCCCA3] text-sm sm:text-base">
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>If on Wi-Fi — move closer to the router or switch to a wired connection. Wi-Fi interference is the most common cause of intermittent packet loss at home.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>Check the cable between your router and your modem (the box your ISP gave you). A loose or damaged cable here causes drops.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>Restart your router and modem. Unplug the modem first, wait 30 seconds, plug it back in and wait for all lights to settle before restarting the router.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>If packet loss persists after all the above, screenshot or photograph your ping output — you now have evidence to show your ISP when you call them.</span></li>
              </ul>
            </motion.div>

            {/* Full drop */}
            <motion.div {...fadeUp} className="mb-8">
              <h3 className="text-xl font-bold text-[#F7F5EB] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Complete Drop (Everything Times Out)
              </h3>
              <div className="bg-[#1a2e1e] rounded-lg p-4 font-mono text-xs sm:text-sm space-y-1 mb-4 overflow-x-auto">
                <p className="text-red-400">Request timed out.</p>
                <p className="text-red-400">Request timed out.</p>
                <p className="text-red-400">Request timed out.</p>
                <p className="text-red-400">Request timed out.</p>
                <p className="text-[#6ee37e]">Reply from 8.8.8.8: bytes=32 time=<span className="text-yellow-300">11ms</span> TTL=118</p>
              </div>
              <p className="text-[#DCCCA3] text-sm sm:text-base mb-3">
                Several consecutive timeouts followed by recovery = your connection is dropping completely and coming back. This is the clearest sign of a line instability issue.
              </p>
              <ul className="space-y-2 text-[#DCCCA3] text-sm sm:text-base">
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>Note <em>when</em> the drops happen — are they at the same time each day? Certain drops can be caused by interference from a neighbour's device (especially on ADSL/VDSL lines).</span></li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>Plug a device directly into the modem via Ethernet and run the ping again. If drops continue, the problem is definitely the line or modem — call your ISP.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#C65D2B] font-bold shrink-0">→</span> <span>Keep your ping running for at least 15–30 minutes and count how many drops occur. The more data you can give your ISP, the more seriously they'll take the fault.</span></li>
              </ul>
            </motion.div>

            {/* Calling your ISP */}
            <motion.div
              {...fadeUp}
              className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-[#F7F5EB] mb-3 flex items-center gap-2">
                <Wifi size={20} className="text-[#C65D2B]" />
                When to Call Your ISP
              </h3>
              <p className="text-[#DCCCA3] text-sm sm:text-base mb-4">
                You've ruled out your own devices and network — now it's time to escalate. When you call, have these ready:
              </p>
              <ul className="space-y-2 text-[#DCCCA3] text-sm sm:text-base">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> A screenshot or written log of your ping results showing drops or high latency.</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> Whether the problem affects multiple devices.</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> Whether drops happen at consistent times or randomly.</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> That you've already restarted the router and modem.</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> That you've tested with a wired connection (if possible).</li>
              </ul>
              <p className="text-[#DCCCA3] text-sm mt-4">
                Walking in with evidence rather than just saying "the internet is slow" puts you in a much stronger position and speeds up the support process considerably.
              </p>
            </motion.div>
          </motion.section>

          {/* Closing */}
          <motion.section {...fadeUp} className="text-center border-t border-[#2E4A34] pt-12">
            <p className="text-[#DCCCA3] text-base sm:text-lg max-w-xl mx-auto">
              Internet issues are frustrating — but most of the time they can be diagnosed in under ten minutes with a continuous ping test and a clear head. Take it one step at a time, and you'll either fix it yourself or have solid evidence for whoever needs to fix it for you.
            </p>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default BlogInternetTroubleshooting;
