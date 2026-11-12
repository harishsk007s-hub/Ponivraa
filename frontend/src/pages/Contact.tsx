import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  Sprout,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  BRAND_EMAIL,
  DISPLAY_PHONE,
  FARM_LOCATION,
  GOOGLE_MAPS_LINK,
  getWhatsAppUrl,
  WHATSAPP_PHONE,
} from '../utils/whatsapp';
import { api } from '../api';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateField = (field: string, val: string) => {
    switch (field) {
      case 'name':
        if (!val.trim()) return 'Name is required';
        break;
      case 'phone': {
        const clean = val.replace(/\D/g, '');
        if (!/^[6-9]\d{9}$/.test(clean)) {
          return 'Enter a valid 10-digit mobile number';
        }
        break;
      }
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
          return 'Enter a valid email address';
        }
        break;
      case 'message':
        if (!val.trim() || val.trim().length < 10) {
          return 'Message must be at least 10 characters long';
        }
        break;
      default:
        break;
    }
    return '';
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const isFormValid =
    name.trim().length > 0 &&
    /^[6-9]\d{9}$/.test(phone.replace(/\D/g, '')) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const nameErr = validateField('name', name);
    const phoneErr = validateField('phone', phone);
    const emailErr = validateField('email', email);
    const msgErr = validateField('message', message);

    const allErrors = { name: nameErr, phone: phoneErr, email: emailErr, message: msgErr };
    setErrors(allErrors);
    setTouched({ name: true, phone: true, email: true, message: true });

    if (Object.values(allErrors).some((err) => Boolean(err))) {
      return;
    }

    try {
      setSubmitting(true);
      await api.createEnquiry({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      });

      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setErrors({});
      setTouched({});
    } catch (err: any) {
      console.error('Contact form submission failed:', err);
      setServerError(err.message || 'Failed to submit enquiry. Please message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-lightgreen text-primary text-xs font-bold px-3 py-1 rounded-full border border-lightgreen-border uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-accent" />
            <span>Direct Farm Correspondence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-darktext">
            Get in Touch with Ponivraa
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Have questions about today's tree harvest, raw honey varieties, bulk celebration boxes, or farm visits? We would love to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Farm Details & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-serif font-bold text-darktext pb-3 border-b border-gray-100">
                Farm Dispatch Headquarters
              </h2>

              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lightgreen text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-bold text-darktext block">Location</span>
                    <p className="text-xs text-gray-600">{FARM_LOCATION}</p>
                    <a
                      href={GOOGLE_MAPS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lightgreen text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-bold text-darktext block">Phone & WhatsApp</span>
                    <a href={`tel:${WHATSAPP_PHONE}`} className="text-xs text-gray-600 hover:text-primary">
                      {DISPLAY_PHONE}
                    </a>
                    <span className="text-[10px] text-gray-400 block">Monday to Sunday, 7:00 AM - 8:00 PM</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lightgreen text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-bold text-darktext block">Email</span>
                    <a href={`mailto:${BRAND_EMAIL}`} className="text-xs text-gray-600 hover:text-primary">
                      {BRAND_EMAIL}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lightgreen text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-bold text-darktext block">Harvest Dispatch Timings</span>
                    <p className="text-xs text-gray-600">Fresh harvest picking: 5:30 AM to 9:30 AM daily</p>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={getWhatsAppUrl('Hello Ponivraa team, I am reaching out through the contact page.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3.5 rounded-xl shadow transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat Directly on WhatsApp ({DISPLAY_PHONE})</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#F4FAF5] border border-[#C8E6C9] text-darktext rounded-3xl p-6 space-y-2 shadow-sm">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-[#1B4332]">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Visit Our Orchards</span>
              </h3>
              <p className="text-xs text-[#2D5A32] leading-relaxed">
                We welcome family visits to our Alagarkovil foothill farm. Experience organic mango harvesting firsthand and taste fruits straight from the branch.
              </p>
            </div>
          </div>

          {/* Right Column: Validated Contact Form & Google Maps Embed */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
              <h2 className="text-xl font-serif font-bold text-darktext mb-2">
                Send a Message to Our Farm
              </h2>
              {/* Changed growers to farmers */}
              <p className="text-xs text-gray-500 mb-6">
                All enquiries are saved directly to our farm administrative system and reviewed by our farmers.
              </p>

              {submitted ? (
                <div className="bg-lightgreen border border-lightgreen-border rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-primary">Message Received!</h3>
                  <p className="text-xs text-[#2D5A32] max-w-sm mx-auto">
                    Thank you for contacting Ponivraa. Our team in Alagarkovil will review your enquiry and respond promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-primary font-bold underline hover:text-primary-hover cursor-pointer"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {serverError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-semibold">
                      {serverError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meenakshi Sundaram"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        onBlur={() => handleBlur('name', name)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                          touched.name && errors.name
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-gray-200'
                        }`}
                      />
                      {touched.name && errors.name && (
                        <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9443210987"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhone(val);
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        onBlur={() => handleBlur('phone', phone)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                          touched.phone && errors.phone
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-gray-200'
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. meenakshi@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      onBlur={() => handleBlur('email', email)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                        touched.email && errors.email
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                    {touched.email && errors.email && (
                      <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Message / Enquiry *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the fruits or honey varieties you are interested in, quantity requirements, or celebration box orders..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      onBlur={() => handleBlur('message', message)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none resize-none ${
                        touched.message && errors.message
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                    {touched.message && errors.message && (
                      <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !isFormValid}
                    className="w-full py-3.5 px-6 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {submitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Farm Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-darktext">Orchard Map Location</h3>
                  <span className="text-xs text-gray-500">Alagarkovil, Tamil Nadu, India</span>
                </div>
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 relative bg-cream">
                <iframe
                  title="Ponivraa Farm Location in Alagarkovil"
                  src="https://maps.google.com/maps?q=Alagarkovil,+Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
