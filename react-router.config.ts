import type {Config} from '@react-router/dev/config';
import {hydrogenPreset} from '@shopify/hydrogen/react-router-preset';

/**
 * This configuration uses the official Hydrogen preset to provide optimal
 * React Router settings for Shopify Oxygen deployment. The preset enables
 * validated performance optimizations while ensuring compatibility.
 */
export default {
  presets: [hydrogenPreset()],
  future: {
    // Disable middleware to use legacy context pattern (context.storefront vs context.get())
    // This is required until route files are migrated to use context.get(hydrogenContext.*)
    v8_middleware: false,
  },
} satisfies Config;
