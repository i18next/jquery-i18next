const lngs = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' }
};

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

$(function () {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    .use(i18nextHttpBackend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: true,
      fallbackLng: 'en',
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
