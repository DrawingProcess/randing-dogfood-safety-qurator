-- Clear dogfood analytics so official launch stats start from zero.
-- Does not touch products, badges, images, or survey_responses.

delete from public.analytics_events;
