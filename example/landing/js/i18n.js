const getGreetingTime = () => {
  const split_afternoon = 12; // 24hr time to split the afternoon
  const split_evening = 17; // 24hr time to split the evening
  const currentHour = moment().hour();

  if (currentHour >= split_afternoon && currentHour <= split_evening) {
    return 'afternoon';
  } else if (currentHour >= split_evening) {
    return 'evening';
  }
  return 'morning';
}

const rerender = () => {
  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $('body').localize();
  $('#footerMessage').localize({ context: getGreetingTime() });
  $('title').text($.t('head.title'))
  $('meta[name=description]').attr('content', $.t('head.description'))
}

const locizeOptions = {
  projectId: '8d751621-323e-4bda-94c8-7d2368102e62',
  apiKey: '302aca54-2ea8-4b9f-b5f0-df1369c59427' // YOU should not expose your apps API key to production!!!
};

$(function () {
  const locizeBackend = new i18nextLocizeBackend(locizeOptions, (err, opts, lngs) => {
    if (err) return console.error(err);

    // use plugins and options as needed, for options, detail see
    // https://www.i18next.com
    i18next
      // locize-editor
      // InContext Editor of locize
      .use(locize.locizePlugin)
      // locize-lastused (do not use this in production)
      // sets a timestamp of last access on every translation segment on locize
      // -> safely remove the ones not being touched for weeks/months
      // https://github.com/locize/locize-lastused
      .use(locizeLastUsed)
      // i18next-locize-backend
      // loads translations from your project, saves new keys to it (saveMissing: true)
      // https://github.com/locize/i18next-locize-backend
      .use(locizeBackend)
      // detect user language
      // learn more: https://github.com/i18next/i18next-browser-languageDetector
      .use(i18nextBrowserLanguageDetector)
      // init i18next
      // for all options read: https://www.i18next.com/overview/configuration-options
      .init({
        ...opts,
        debug: true,
        fallbackLng: 'en',
        backend: locizeOptions,
        locizeLastUsed: locizeOptions,
        saveMissing: true
        // interpolation: {
        //   // legacy usage
        //   format: (value, format, lng) => {
        //     if (value instanceof Date) {
        //       return moment(value).locale(lng).format(format);
        //     }
        //     return value;
        //   }
        // }
      }, (err, t) => {
        if (err) return console.error(err);

        // new usage
        i18next.services.formatter.add('LLLL', (value, lng, options) => {
          return moment(value).locale(lng).format('LLLL');
        });

        // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $, { useOptionsAttr: true });

        // fill language switcher
        Object.keys(lngs).map((lng) => {
          const opt = new Option(lngs[lng].nativeName, lng);
          if (lng === i18next.resolvedLanguage) {
            opt.setAttribute("selected", "selected");
          }
          $('#languageSwitcher').append(opt);
        });
        let languageChangedCounter = 0;
        $('#languageSwitcher').change((a, b, c) => {
          const chosenLng = $(this).find("option:selected").attr('value');
          i18next.changeLanguage(chosenLng, () => {
            rerender();
            
            // language changed message
            languageChangedCounter++;
            $('#languageChangedNotification').localize({ count: languageChangedCounter })
            if (languageChangedCounter === 1) {
              $('#languageChangedNotification').show();
            }
          });
        });

        rerender();

        $('#loader').hide();
        $('#content').show();
      });
  });
});
