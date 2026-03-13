import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#4A7DFF] to-[#FF7555] rounded-2xl p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Find the Best Teachers?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions and teachers who trust Gravity for their hiring needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register?type=school')}
              className="bg-white text-[#4A7DFF] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Post a Job
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => navigate('/register')}
              className="bg-white/20 border border-white/30 text-white hover:bg-white/30 px-8 py-3 rounded-lg font-semibold text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Find Teachers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;