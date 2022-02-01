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
      // },
      resources: {
        en: {
          translation: {
            head: {
              title: "My Awesome Landing-Page",
              description: "The description of this awesome landing page."
            },
            about: {
              title: "About my awesome Landing-Page",
              description: "This is a fantastic website presenting..."
            },
            counter_one: "Changed language just once",
            counter_other: "Changed language already {{count}} times",
            footer: {
              date: "It's {{date, LLLL}}",
              date_morning: "Good morning! Today is {{date, LLLL}} | Have a nice day!",
              date_afternoon: "Good afternoon! It\'s {{date, LLLL}}",
              date_evening: "Good evening! Today was the {{date, LLLL}}"
            }
          }
        },
        de: {
          translation: {
            head: {
              title: "Meine grossartige Webseite",
              description: "Die Beschreibung dieser grossartigen Webseite."
            },
            about: {
              title: "Über meine grossartige Webseite",
              description: "Dies ist eine fantastische Website, die sich folgendermassen präsentiert..."
            },
            counter_one: "Die Sprache wurde erst ein mal gewechselt",
            counter_other: "Die Sprache wurde {{count}} mal gewechselt",
            footer: {
              date: "Es ist {{date, LLLL}}",
              date_morning: "Guten Morgen! Heute ist {{date, LLLL}} | Wünsche einen schönen Tag!",
              date_afternoon: "Guten Tag! Es ist {{date, LLLL}}",
              date_evening: "Guten Abend! Heute war {{date, LLLL}}"
            }
          }
        }
      }
    }, (err, t) => {
      if (err) return console.error(err);

      // new usage
      i18next.services.formatter.add('LLLL', (value, lng, options) => {
        return moment(value).locale(lng).format('LLLL');
      });

      // for options see
      // https://github.com/i18next/jquery-i18next#initialize-the-plugin
      jqueryI18next.init(i18next, $, { useOptionsAttr: true });

      rerender();

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
    });
});
