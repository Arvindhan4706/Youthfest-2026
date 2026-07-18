export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    
    const existingScript = document.getElementById('razorpay-sdk');
    if (existingScript) {
      let attempts = 0;
      const interval = setInterval(() => {
        if ((window as any).Razorpay) {
          clearInterval(interval);
          resolve(true);
        }
        attempts++;
        if (attempts > 50) {
          clearInterval(interval);
          resolve(false);
        }
      }, 150);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    
    // BYPASS ADBLOCKER: Load from our own domain instead of checkout.razorpay.com
    script.src = '/payment-sdk.js';
    
    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};
