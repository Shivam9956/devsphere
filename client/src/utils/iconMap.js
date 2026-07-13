import {
  FiCode, FiLayout, FiDatabase, FiSmartphone, FiShoppingCart, FiServer,
  FiGlobe, FiTrendingUp, FiSettings, FiZap, FiStar, FiHeart, FiMail,
  FiCamera, FiVideo, FiBook, FiCpu, FiCloud, FiShield, FiBarChart2,
  FiPenTool, FiMonitor, FiTablet, FiPackage, FiLayers, FiTerminal,
  FiGitBranch, FiSearch, FiLink, FiUsers, FiMessageSquare, FiHeadphones,
  FiAward, FiTarget, FiTool, FiRefreshCw, FiUploadCloud, FiLock,
  FiCheckCircle, FiActivity, FiBox, FiGrid, FiSliders, FiEdit3,
  FiFileText, FiImage, FiMic, FiWifi, FiSend, FiDollarSign
} from 'react-icons/fi';

export const iconMap = {
  // Development
  FiCode: <FiCode size={26} />,
  FiTerminal: <FiTerminal size={26} />,
  FiGitBranch: <FiGitBranch size={26} />,
  FiLayers: <FiLayers size={26} />,
  FiCpu: <FiCpu size={26} />,
  FiServer: <FiServer size={26} />,
  FiDatabase: <FiDatabase size={26} />,
  FiCloud: <FiCloud size={26} />,
  FiUploadCloud: <FiUploadCloud size={26} />,
  FiBox: <FiBox size={26} />,

  // Design & UI
  FiLayout: <FiLayout size={26} />,
  FiMonitor: <FiMonitor size={26} />,
  FiTablet: <FiTablet size={26} />,
  FiSmartphone: <FiSmartphone size={26} />,
  FiPenTool: <FiPenTool size={26} />,
  FiEdit3: <FiEdit3 size={26} />,
  FiImage: <FiImage size={26} />,
  FiGrid: <FiGrid size={26} />,
  FiSliders: <FiSliders size={26} />,

  // Business & Marketing
  FiShoppingCart: <FiShoppingCart size={26} />,
  FiTrendingUp: <FiTrendingUp size={26} />,
  FiBarChart2: <FiBarChart2 size={26} />,
  FiTarget: <FiTarget size={26} />,
  FiDollarSign: <FiDollarSign size={26} />,
  FiAward: <FiAward size={26} />,
  FiStar: <FiStar size={26} />,
  FiActivity: <FiActivity size={26} />,

  // Communication
  FiMail: <FiMail size={26} />,
  FiMessageSquare: <FiMessageSquare size={26} />,
  FiSend: <FiSend size={26} />,
  FiMic: <FiMic size={26} />,
  FiHeadphones: <FiHeadphones size={26} />,
  FiUsers: <FiUsers size={26} />,

  // Content & Media
  FiCamera: <FiCamera size={26} />,
  FiVideo: <FiVideo size={26} />,
  FiBook: <FiBook size={26} />,
  FiFileText: <FiFileText size={26} />,

  // Tech & Tools
  FiGlobe: <FiGlobe size={26} />,
  FiWifi: <FiWifi size={26} />,
  FiLink: <FiLink size={26} />,
  FiSearch: <FiSearch size={26} />,
  FiSettings: <FiSettings size={26} />,
  FiTool: <FiTool size={26} />,
  FiRefreshCw: <FiRefreshCw size={26} />,
  FiShield: <FiShield size={26} />,
  FiLock: <FiLock size={26} />,
  FiCheckCircle: <FiCheckCircle size={26} />,

  // General
  FiZap: <FiZap size={26} />,
  FiHeart: <FiHeart size={26} />,
  FiPackage: <FiPackage size={26} />,
};

// Grouped for dropdown display
export const iconGroups = {
  'Development': ['FiCode', 'FiTerminal', 'FiGitBranch', 'FiLayers', 'FiCpu', 'FiServer', 'FiDatabase', 'FiCloud', 'FiUploadCloud', 'FiBox'],
  'Design & UI': ['FiLayout', 'FiMonitor', 'FiTablet', 'FiSmartphone', 'FiPenTool', 'FiEdit3', 'FiImage', 'FiGrid', 'FiSliders'],
  'Business': ['FiShoppingCart', 'FiTrendingUp', 'FiBarChart2', 'FiTarget', 'FiDollarSign', 'FiAward', 'FiStar', 'FiActivity'],
  'Communication': ['FiMail', 'FiMessageSquare', 'FiSend', 'FiMic', 'FiHeadphones', 'FiUsers'],
  'Content': ['FiCamera', 'FiVideo', 'FiBook', 'FiFileText'],
  'Tech & Tools': ['FiGlobe', 'FiWifi', 'FiLink', 'FiSearch', 'FiSettings', 'FiTool', 'FiRefreshCw', 'FiShield', 'FiLock', 'FiCheckCircle'],
  'General': ['FiZap', 'FiHeart', 'FiPackage'],
};

export function getIcon(name) {
  return iconMap[name] || iconMap['FiCode'];
}
