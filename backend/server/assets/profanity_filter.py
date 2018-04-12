import settings.profanity_filter_settings as local_settings
import settings.global_settings as global_settings

class ProfanityFilter:
    bad_words_list = local_settings.BAD_WORDS_LIST
    replacement_symbols = local_settings.REPLACEMENT_SYMBOLS

    @classmethod
    def filter(cls, text):
        for bad_word in cls.bad_words_list:
            if bad_word in text.lower():
                mask = cls.get_mask(len(bad_word))
                text = text.lower().replace(bad_word, mask)
        return text

    @classmethod
    def get_mask(cls, length):
        # generates a mask of specified length
        result = ""
        for i in range(length):
            result += cls.replacement_symbols[i % len(cls.replacement_symbols)]
        return result


