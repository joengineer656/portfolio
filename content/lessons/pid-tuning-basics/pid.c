// Minimal PID controller with integrator clamping (anti-windup).
typedef struct { float kp, ki, kd, i_max, i_term, prev_err; } Pid;

static float clampf(float v, float lo, float hi) { return v < lo ? lo : v > hi ? hi : v; }

float pid_step(Pid *p, float setpoint, float measured, float dt) {
  float err = setpoint - measured;
  p->i_term = clampf(p->i_term + p->ki * err * dt, -p->i_max, p->i_max);
  float d = (err - p->prev_err) / dt;
  p->prev_err = err;
  return p->kp * err + p->i_term + p->kd * d;
}
