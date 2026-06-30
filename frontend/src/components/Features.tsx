import { Box, Typography, Container, Grid } from '@mui/material';

interface ZoneBlockProps {
  zoneNum: string;
  title: string;
  description: string;
  details: string[];
  imageSrc: string;
  alternate?: boolean;
  type?: 'fog' | 'cream';
}

const ZoneBlock = ({ zoneNum, title, description, details, imageSrc, alternate = false, type = 'fog' }: ZoneBlockProps) => {
  const isCream = type === 'cream';
  return (
    <Box
      sx={{
        mb: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
        borderBottom: '1px solid #e6e6e6',
        '&:last-child': {
          borderBottom: 'none',
          mb: 0,
          pb: 0,
        },
      }}
    >
      <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
        {/* Text Side (Column 1 or 2 depending on alternation) */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ order: { xs: 2, md: alternate ? 2 : 1 } }}
        >
          {/* Zone Title / Header */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2.5 }}>
            <Typography
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                fontSize: { xs: '18px', md: '22px' },
                color: 'text.secondary',
              }}
            >
              {zoneNum}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textTransform: 'uppercase',
                fontSize: { xs: '22px', md: '30px' },
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Description Block */}
          <Box
            sx={{
              backgroundColor: isCream ? 'creamStone.main' : 'fog.main',
              borderRadius: '8px',
              p: { xs: 3, md: 3.5 },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                lineHeight: 1.6,
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              {description}
            </Typography>
            
            {/* Details list */}
            <Box
              component="ul"
              sx={{
                p: 0,
                m: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {details.map((detail, idx) => (
                <Box
                  key={idx}
                  component="li"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13.5px',
                    color: 'text.secondary',
                  }}
                >
                  <Box
                    sx={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: 'text.primary',
                      mr: 1.5,
                      opacity: 0.6,
                      flexShrink: 0,
                    }}
                  />
                  {detail}
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Image Side (Column 2 or 1 depending on alternation) */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ order: { xs: 1, md: alternate ? 1 : 2 } }}
        >
          <Box
            sx={{
              width: '100%',
              height: { xs: '240px', sm: '300px', md: '340px' },
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f2f2f2',
            }}
          >
            <Box
              component="img"
              src={imageSrc}
              alt={`gymOS ${title}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(100%) brightness(95%) contrast(105%)',
                display: 'block',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.015)',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export const Features = () => {
  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e6e6e6',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Section Header */}
        <Box sx={{ maxWidth: '900px', mb: { xs: 8, md: 10 } }}>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              mb: 2,
            }}
          >
            Specifications
          </Typography>
          <Typography
            variant="h2"
            sx={{
              textTransform: 'uppercase',
              fontWeight: 800,
              mb: 3,
            }}
          >
            Built for progression.
            <br />
            Configured for athletes.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '680px',
            }}
          >
            Six specialized training environments and services integrated under a unified coaching philosophy. Every station is calibrated for peak performance.
          </Typography>
        </Box>

        {/* Feature Stack (Alternating Side-by-Side Layout) */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <ZoneBlock
            zoneNum="01"
            title="Strength Sanctuary"
            description="A dedicated platform layout featuring competition-grade power racks, Eleiko barbells, and calibrated steel plates. Configured for squats, deadlifts, and raw power execution."
            details={['Calibrated steel and bumper plates', 'Powerlifting and Olympic platforms', 'Chalk stations and heavy duty racks', 'Dumbbells ranging from 5lbs to 150lbs']}
            imageSrc="/gym_zone1_strength.jpg"
            alternate={false}
            type="fog"
          />
          <ZoneBlock
            zoneNum="02"
            title="Conditioning Arena"
            description="A high-traction turf lane designed for heavy sled pushes, sprint drills, air bikes, and concept rowers. Focused on metabolic capacity and physical endurance."
            details={['25-yard premium turf lane', 'Weighted sleds, AirBikes and Rowers', 'Kettlebell racks and wall-ball stations']}
            imageSrc="/gym_zone2_conditioning.jpg"
            alternate={true}
            type="fog"
          />
          <ZoneBlock
            zoneNum="03"
            title="Coaching Bureau"
            description="Direct collaboration with elite strength coaches. Includes custom workout programming, real-time posture assessments, and movement audits tailored to your body type."
            details={['1-on-1 personal programming', 'Form analysis and movement screens', 'Olympic lifting posture audits']}
            imageSrc="/gym_zone3_coaching.jpg"
            alternate={false}
            type="fog"
          />
          <ZoneBlock
            zoneNum="04"
            title="Digital Member Portal"
            description="Every membership gets access to the custom gymOS digital workspace. View your customized weekly workout schemes, log exercise weights, and check in at the reception desk."
            details={['Direct access to assigned workouts', 'Weight progression and history logging', 'Instant reception QR check-in code']}
            imageSrc="/gym_zone4_portal.jpg"
            alternate={true}
            type="fog"
          />
          <ZoneBlock
            zoneNum="05"
            title="Custom Training Templates"
            description="Access our database of signature programming structures (Push/Pull/Legs, Strength Engine, Athletic Base). Built, tested, and updated by coaches to prevent progression plateaus."
            details={['Customizable athletic templates', 'Periodized strength blocks', 'Active progression updates']}
            imageSrc="/gym_zone5_templates.jpg"
            alternate={false}
            type="cream"
          />
          <ZoneBlock
            zoneNum="06"
            title="Anthropometric Audits"
            description="Periodic body composition audits, weight tracking, and circumference logs. Helps coaches refine your nutritional targets and training volume based on physical feedback."
            details={['Bi-weekly body composition scans', 'Girth and anthropometric tracking', 'Historical comparison reports']}
            imageSrc="/gym_zone6_audits.jpg"
            alternate={true}
            type="cream"
          />
        </Box>
      </Container>
    </Box>
  );
};
